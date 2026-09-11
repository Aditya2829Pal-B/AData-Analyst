# 7-Slide Management Presentation

## Slide 1 — Business Problem
Improve revenue quality and customer retention by understanding customer concentration, repeat purchasing, seasonality and cancellation risk.

## Slide 2 — Data & Methodology
UCI Online Retail II; 1,067,371 raw rows; deduplication; cancellation separation; product-code filtering; positive-price filtering; Revenue = Quantity × UnitPrice; RFM and cohort/lifecycle analysis.

## Slide 3 — Key Findings
- Champions: ~25% of identified customers, 69% of identified revenue.
- Month-1 repeat: 23.3%; month-12: 22.7%.
- Resurrected buyers: ~439/month vs ~390 retained.
- November: ~£1.4M peak in both 2010 and 2011.
- Return/cancellation value rate: ~3.65%.

## Slide 4 — Deep Dive
One-month inactivity is not a reliable churn signal. Repeat rates remain around 22% through month 12 and resurrection flows are substantial. The source's wholesale-heavy customer mix provides a plausible business explanation, but customer type is not directly labelled.

## Slide 5 — Recommendations
1. Protect Champions.
2. Build resurrection/win-back journeys.
3. Pre-plan November inventory and fulfilment capacity.

## Slide 6 — Expected Business Impact
Measure Champion retention, recovered revenue, reactivation rate, November fill rate, stockouts, net revenue, return rate and forecast error.

## Slide 7 — Limitations & Next Steps
Missing CustomerID, cancellation outliers, partial December 2011, single-company scope and absence of cost/margin data. Next: connect CRM/customer-type, margin and campaign data.
