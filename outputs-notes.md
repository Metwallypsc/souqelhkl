# Souq Al-Haql (سوق الحقل) — Admin Dashboard Requirements Analysis: Product Approvals & Order Reviews

## 1. Executive Summary & Business Objective
This document defines the comprehensive functional requirements, business rules, workflows, acceptance criteria, and technical specifications for the **Admin Dashboard - Product Approvals** and **Order Reviews** modules within the **Souq Al-Haql** multi-vendor agricultural marketplace.

---

## 2. Module A: Admin Product Approvals (`ProductApprovals`)

### 2.1. Business Objective
To maintain catalog integrity, prevent unauthorized or restricted goods (e.g., restricted pesticides requiring legal compliance), ensure accurate pricing/units, and maintain quality standards before listings or base products go live on the storefront.

### 2.2. Actors & Permissions
- **Vendor:** Submits base products (`Product`) or vendor listings (`Listing`) which enter `PENDING_REVIEW` state.
- **Admin:** Reviews pending products/listings, checks attributes, pricing, categories, and images, then approves (`APPROVED`), rejects (`REJECTED`), or hides (`HIDDEN`) them.

### 2.3. Functional Requirements & Workflow
1. **Submission Trigger:** When a vendor creates or updates a product/listing, its status is set to `PENDING_REVIEW`.
2. **Admin Queue UI:** 
   - A dedicated tab/page in the Admin Dashboard: `سوق الحقل - المنتجات بانتظار المراجعة` (`/admin/products/pending`).
   - Displays items with details: Product Name, Category, Vendor Name, Price (`priceEgp`), Unit (`unitNameAr`), Stock, and Images.
3. **Approval Actions:**
   - **Approve:** Changes status to `APPROVED`. The product/listing immediately becomes visible on the customer storefront. Logs actor and timestamp in `AuditLog`.
   - **Reject:** Changes status to `REJECTED`. Requires an mandatory rejection reason note (`rejectionReason`). Vendor is notified via their dashboard.
   - **Hide / Suspend:** Changes status to `HIDDEN` if previously approved products violate policies later.
4. **Data Validation Rules:**
   - Base product must have a valid category (`categoryId`).
   - Listing must have positive price (`priceEgp > 0`), valid unit (`unitNameAr`), and non-negative stock quantity (`stockQuantity >= 0`).
   - Weight (`weightGrams`) must be specified for shipping calculation accuracy.

### 2.4. Edge Cases & Exception Handling
- **Vendor Edits Approved Product:** If an approved vendor updates price or stock, does it require re-approval? *Decision:* Price or critical attribute changes trigger re-approval (`PENDING_REVIEW`), whereas minor stock updates can auto-sync unless configured otherwise.
- **Category Deletion:** If a category is deactivated, pending products in that category cannot be approved until reassigned.
- **Empty Image Uploads:** Products without at least one valid image URL cannot be approved.

### 2.5. Acceptance Criteria
- **AC-PA-01:** Given a vendor submits a new listing, when saved, then its status defaults to `PENDING_REVIEW` and it does not appear in customer searches.
- **AC-PA-02:** Given an admin views the pending queue, when they click "Approve", then the listing status updates to `APPROVED` and it appears on [`src/app/products/[slug]/page.tsx`](../Documents/Codex/2026-08-10/uh/work/src/app/products/[slug]/page.tsx).
- **AC-PA-03:** Given an admin rejects a product, when they submit without a reason, then the system displays a validation error requiring a rejection reason.

---

## 3. Module B: Order Reviews & Management (`OrderReviews`)

### 3.1. Business Objective
To oversee multi-vendor orders, verify manual payments (especially InstaPay transfer screenshots), manage vendor order fulfillment parts (`VendorOrder`), track collection at the central warehouse, calculate the 1% platform commission upon completion, and maintain complete audit trails.

### 3.2. Actors & Permissions
- **Customer:** Places orders, chooses payment method (`CASH_ON_DELIVERY` or `INSTAPAY`), uploads transfer receipts, and cancels orders before shipping.
- **Vendor:** Views their specific sub-order (`VendorOrder`), accepts/rejects items with mandatory reasons, and marks items as delivered to the collection center.
- **Admin:** Reviews overall orders (`Order`), verifies InstaPay payment slips (`Payment`), adjusts manual shipping fees if needed (`ShippingDetail`), monitors vendor fulfillment, and tracks commissions (`Commission`).

### 3.3. Functional Requirements & Workflow
1. **Order Creation (`Order` & `VendorOrder`):**
   - When a customer checks out, the main order is created with status `NEW`.
   - Sub-orders (`VendorOrder`) are generated per participating vendor with status `PENDING`.
   - Order items snapshot product names, vendor names, unit prices, and weights into `OrderItem` to protect against future catalog changes.
2. **Payment Verification (`Payment`):**
   - If payment method is `INSTAPAY`, the customer uploads a transfer screenshot (`transferImageUrl`), setting payment status to `UPLOADED`.
   - Admin reviews the screenshot in `/admin/payments`:
     - **Approve:** Updates payment status to `APPROVED`, advances order status from `NEW` to `UNDER_REVIEW` or `AWAITING_VENDOR_CONFIRMATION`.
     - **Reject / Re-upload:** Updates payment status to `REJECTED`, allowing the customer to re-upload or contact support via WhatsApp.
   - If payment method is `CASH_ON_DELIVERY`, payment status starts as `PENDING` and is settled upon delivery.
3. **Vendor Order Processing:**
   - Vendors view their sub-orders in `/vendor/orders`.
   - Vendors either **Accept** (`ACCEPTED`) or **Reject** (`REJECTED` with mandatory `rejectionReason`).
   - If a vendor rejects an item/sub-order, the admin handles the adjustment (no automatic reassignment to another vendor in v1).
4. **Collection & Shipping:**
   - Vendors deliver goods to the single Cairo collection center (`DELIVERED_TO_COLLECTION_CENTER`).
   - Admin/Warehouse supervisor verifies receipt, updates main order to `READY_FOR_SHIPPING` and then `SHIPPED` when handed over to the shipping carrier.
   - Shipping fee is calculated as 100 EGP base fee up to 10 kg, plus 25 EGP per extra kg (or manual admin adjustment).
5. **Completion & Commission:**
   - Once delivery is confirmed, admin marks order as `COMPLETED`.
   - System calculates 1% commission (`Commission`) on sales amount for each participating vendor, recording it in the `Commission` table.
   - Audit log records all status transitions in `OrderStatusHistory` and `AuditLog`.

### 3.4. Edge Cases & Exception Handling
- **Partial Vendor Rejection:** One vendor accepts while another rejects. The order proceeds with the accepted vendor's items; rejected items are canceled/refunded according to admin review.
- **Invalid InstaPay Receipt:** Admin rejects transfer receipt; customer is notified to re-upload.
- **Customer Cancellation:** Customer attempts cancellation after order reaches `SHIPPED` status. *Rule:* Blocked; cancellation is only permitted before shipping (`NEW`, `UNDER_REVIEW`, `AWAITING_VENDOR_CONFIRMATION`).
- **Weight Calculation Overflows:** Exceeding 10 kg correctly triggers extra weight fee tiers.

### 3.5. Acceptance Criteria
- **AC-OR-01:** Given an order with InstaPay payment, when the customer uploads a receipt, then payment status becomes `UPLOADED` and admin sees it in the verification queue.
- **AC-OR-02:** Given an admin approves an InstaPay payment, when confirmed, then the order transitions to review/vendor confirmation stage.
- **AC-OR-03:** Given a vendor receives a sub-order, when they reject it, then a rejection reason is mandatory and the sub-order status updates to `REJECTED`.
- **AC-OR-04:** Given an order reaches `COMPLETED` status, when processed, then a 1% commission record is successfully generated for each vendor item.

---

## 4. Database Schema Alignment Summary
The requirements align with the Prisma schema (`prisma/schema.prisma`), utilizing:
- `Product`, `Listing`, `ListingOption` for product approvals.
- `Order`, `OrderItem`, `VendorOrder`, `Payment`, `ShippingDetail`, `Commission`, `OrderStatusHistory`, `AuditLog` for order management and reviews.

## 5. Handoff to Engineering & QA Teams
- **Architect:** Review workflow state machines for `OrderStatus` and `VendorOrderStatus`.
- **Full-Stack Engineers:** Implement `/admin/products/pending` and `/admin/orders` dashboard views with server actions.
- **Quality Engineers:** Execute test suites covering AC-PA-01 through AC-OR-04, specifically testing InstaPay review flows and multi-vendor sub-order rejections.
