# VirtuBox Data Analyst Assessment — Complete Written Submission

## Q1 — Dataset
**Dataset:** Online Retail II  
**Source:** UCI Machine Learning Repository  
**URL:** https://archive.ics.uci.edu/dataset/502/online+retail+ii  
**Raw size:** 1,067,371 rows; 8 columns  
**Period:** Dec 2009–Dec 2011  

The dataset contains transaction-level information for a UK-based non-store online retailer selling mainly giftware. The source notes that many customers are wholesalers. It was selected because it is large, real-world, business-focused, multi-dimensional and contains genuine data-quality issues.

## Q2 — Business problem
Management needs to understand revenue concentration, repeat purchasing, seasonality and cancellation/return risk so that it can protect high-value revenue and improve operational planning.

### Analytical questions
1. How concentrated is revenue across customer-value segments?
2. How strong is repeat purchasing after acquisition?
3. When does demand peak and what does this imply for planning?
4. Where are returns/cancellations concentrated?
5. Which customer and operational opportunities should management prioritise?

### Hypotheses
- H1: A relatively small group of high-value customers contributes a disproportionate share of revenue.
- H2: Demand is strongly seasonal, with November being a major peak.
- H3: One-month inactivity is not a reliable churn indicator in this wholesale-heavy business.

## Q3 — Processing
- Removed 34,335 exact duplicate rows.
- Separated cancellation invoices from positive sales.
- Removed 4,628 operational/non-product stock-code rows.
- Removed 5,964 zero/negative-price rows for positive-price revenue analysis.
- Converted InvoiceDate to datetime and Quantity/UnitPrice to numeric.
- Created Revenue = Quantity × UnitPrice.
- Missing CustomerID rows were retained for total revenue analysis but excluded from customer-level RFM/cohort calculations.
- Final benchmark sales frame: 1,003,340 rows.
- Returns/cancellation frame: 17,914 rows.

## Q4 — Business insights
### 1. Revenue concentration
Champions represent about 25% of identified customers but generate 69% of identified-customer revenue. This makes retention of high-value accounts strategically important.

### 2. Retention is stable rather than continuously collapsing
Month-1 repeat rate is 23.3%, month-6 is 22.2% and month-12 is 22.7%. This suggests that customers can have long purchase gaps without necessarily being lost.

### 3. Resurrection is important
A typical month has approximately 439 resurrected buyers versus 390 retained buyers. A win-back/resurrection strategy therefore has meaningful potential.

### 4. November is the key seasonal peak
Monthly revenue reaches approximately £1.4M in both November 2010 and November 2011. Inventory, supplier and fulfilment planning should be completed before this period.

### 5. Returns are material but volatile
Overall return/cancellation value is approximately 3.65% of gross value, while individual months can show much higher rates because of large cancellation events.

### 6. Gross product rankings require cancellation context
One product is associated with an 80,995-unit same-day-cancelled order. A gross leaderboard can therefore exaggerate apparent demand if cancellations are not separated.

## Q5 — Surprising result
**Expected:** one missed month would be a strong early churn signal.  
**Observed:** repeat rates remain near 22% from month 1 through month 12, and resurrected buyers outnumber retained buyers in a typical month.  
**Likely explanation:** the source describes many customers as wholesalers, and wholesale purchasing can be periodic.  
**Conclusion:** use longer inactivity windows and distinguish dormant/resurrected customers from truly lost customers.  
**Caveat:** customer type is not explicitly labelled, so wholesale behaviour is an informed interpretation, not causal proof.

## Q6 — Risks and limitations
1. **Missing CustomerID:** 243,007 raw rows lack CustomerID, limiting customer-level attribution.
2. **Cancellations in raw log:** can inflate gross sales and product rankings if not separated.
3. **Partial final month:** Dec 2011 contains only nine trading days and cannot be compared with a full month without adjustment.
4. **Large cancellation outlier:** an 80,995-unit cancellation can dominate volume charts.
5. **Scope:** one UK retailer; findings do not automatically generalise.
6. **No margin/cost data:** revenue cannot be interpreted as profit.

**Two key limitations:** incomplete customer identification and cancellation-sensitive gross metrics.  
**Unsafe conclusion:** the dataset cannot safely identify the most profitable customer/product segment because it contains no COGS or margin data.

## Q7 — Recommendations
### 1. Protect Champions
Create a strategic-account/VIP retention programme. Owner: Sales/Account Management + CRM. Measure Champion retention, repeat-order rate and revenue retained.

### 2. Build resurrection/win-back journeys
Target At Risk and dormant customers with reorder reminders and personalised outreach. Owner: CRM/Sales/Marketing. Measure reactivation rate, recovered revenue and time-to-next-order.

### 3. Plan for November
Pre-build inventory, supplier and fulfilment capacity and monitor cancellation-heavy products separately. Owner: Operations/Supply Chain/Finance. Measure fill rate, stockouts, net revenue, return rate and forecast error.

## Q8 — Dashboard
Management dashboard should contain:
- KPI cards: gross revenue, sales rows, identified customers, return rate.
- Monthly revenue trend.
- RFM revenue-share chart.
- Cohort repeat-rate trend.
- New/retained/resurrected/lapsed lifecycle comparison.
- Returns/cancellation trend.
- Filters for year, month, country, RFM segment and product.

Every visual must answer a management question; clarity is more important than chart count.

## Q9 — Presentation
The required 7-slide structure is provided separately in the management presentation file/specification:
1. Business problem
2. Data & methodology
3. Key findings
4. Deep-dive insight
5. Recommendations
6. Expected business impact
7. Limitations & next steps

## Q10 — AI usage
AI was used for dataset/workflow brainstorming, coding assistance, debugging support, documentation and visualization planning. AI-generated interpretations were checked against the dataset definition and analytical outputs, especially around cancellation outliers and the partial final month. The candidate remains responsible for validating all submitted figures and conclusions.
