# VirtuBox Data Analyst Assessment — Online Retail II

## Candidate
Aditya Pal — MIET Meerut — B.Tech CSE — 4th Year

## Dataset
Online Retail II — UCI Machine Learning Repository
Official source: https://archive.ics.uci.edu/dataset/502/online+retail+ii

## Business problem
How can management improve revenue quality and customer retention by identifying high-value customer concentration, seasonal demand, product/cancellation risk and repeat-purchase behaviour?

## Main findings
- 1,067,371 raw transaction rows in the source dataset.
- 1,003,340 analysis-ready sales rows in the benchmark cleaning pipeline.
- Gross product revenue is approximately £19.64M.
- Champions are approximately 25% of identified customers but contribute 69% of identified-customer revenue.
- Month-1 repeat rate is 23.3%; month-6 is 22.2%; month-12 is 22.7%.
- A typical month has approximately 439 resurrected buyers versus 390 retained buyers.
- November is the major seasonal peak at roughly £1.4M in both 2010 and 2011.
- Overall return/cancellation value rate is approximately 3.65%.

## Recommendations
1. Protect Champions and other high-value accounts with a strategic-account/VIP retention programme.
2. Build a resurrection/win-back programme using longer inactivity thresholds instead of treating one missed month as churn.
3. Plan inventory, supplier and fulfilment capacity around the November peak and monitor cancellation-heavy products separately.

## Reproducibility
`virtuBox_online_retail_analysis.py` downloads the official UCI dataset and recomputes the processing and core analysis locally. Run it before final submission to verify exact figures.

## Deliverables
- `VirtuBox_Data_Analyst_Assessment.xlsx` — Q1–Q10 workbook
- `VirtuBox_Data_Analyst_Management_Presentation.pptx` — 7-slide management presentation
- `virtuBox_online_retail_analysis.py` — reproducible analysis script
- `dashboard_kpis.csv` and chart assets
- `SUBMISSION_CHECKLIST.md`

## Dashboard
The assessment requires an interactive Google Looker Studio dashboard. Use the Q8 sheet in the workbook to reproduce the KPI cards, monthly trend, RFM segment analysis, cohort retention, lifecycle analysis and returns view. The Looker Studio share link must be created from the candidate's Google account.

## AI use
AI was used for analytical workflow design, coding assistance, documentation, wording and visualization planning. Results and interpretations must be verified against the source dataset before final submission.
