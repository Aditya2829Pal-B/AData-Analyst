"""Reproducible core pipeline for the VirtuBox Data Analyst assessment.

Downloads the official UCI Online Retail II ZIP, combines the two Excel sheets,
removes exact duplicates, separates cancellation invoices, removes non-product
codes and non-positive prices, creates Revenue, and exports core analytical
summaries including monthly revenue, country revenue, product revenue and RFM.
"""
from pathlib import Path
import zipfile
import urllib.request
import pandas as pd

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
OUT = ROOT / "outputs"
DATA.mkdir(exist_ok=True)
OUT.mkdir(exist_ok=True)
URL = "https://archive.ics.uci.edu/static/public/502/online%2Bretail%2Bii.zip"
ZIP_PATH = DATA / "online_retail_ii.zip"

if not ZIP_PATH.exists():
    urllib.request.urlretrieve(URL, ZIP_PATH)

with zipfile.ZipFile(ZIP_PATH) as z:
    xlsx = next(n for n in z.namelist() if n.lower().endswith('.xlsx'))
    z.extract(xlsx, DATA)
    xlsx_path = DATA / xlsx

frames = [pd.read_excel(xlsx_path, sheet_name=s) for s in ['Year 2009-2010','Year 2010-2011']]
df = pd.concat(frames, ignore_index=True)
df.columns = [c.strip().replace(' ','') for c in df.columns]
df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'], errors='coerce')
df['Quantity'] = pd.to_numeric(df['Quantity'], errors='coerce')
df['UnitPrice'] = pd.to_numeric(df['UnitPrice'], errors='coerce')
df = df.drop_duplicates().copy()

cancel = df['Invoice'].astype(str).str.upper().str.startswith('C')
returns = df[cancel].copy()
sales = df[~cancel].copy()
non_product = {'POST','D','M','DOT','BANK CHARGES','AMAZONFEE','ADJUST','ADJUST2','CRUK','C2','TEST001','TEST002','TEST003'}
sales = sales[~sales['StockCode'].astype(str).str.upper().isin(non_product)]
sales = sales[sales['UnitPrice'] > 0].copy()
sales['Revenue'] = sales['Quantity'] * sales['UnitPrice']
sales.to_csv(OUT/'processed_sales.csv', index=False)
returns.to_csv(OUT/'returns.csv', index=False)

sales.assign(Month=sales['InvoiceDate'].dt.to_period('M').astype(str)).groupby('Month', as_index=False)['Revenue'].sum().to_csv(OUT/'monthly_revenue.csv', index=False)
sales.groupby('Country', as_index=False)['Revenue'].sum().sort_values('Revenue', ascending=False).to_csv(OUT/'country_revenue.csv', index=False)
sales.groupby(['StockCode','Description'], dropna=False, as_index=False)['Revenue'].sum().sort_values('Revenue', ascending=False).to_csv(OUT/'product_revenue.csv', index=False)

cust = sales[sales['CustomerID'].notna()].copy()
snapshot = cust['InvoiceDate'].max() + pd.Timedelta(days=1)
rfm = cust.groupby('CustomerID').agg(
    Recency=('InvoiceDate', lambda x: (snapshot-x.max()).days),
    Frequency=('Invoice','nunique'),
    Monetary=('Revenue','sum')).reset_index()
rfm.to_csv(OUT/'rfm_customers.csv', index=False)
print('Raw rows:', len(df))
print('Clean sales rows:', len(sales))
print('Revenue:', round(sales['Revenue'].sum(),2))
print('Identified customers:', rfm['CustomerID'].nunique())
