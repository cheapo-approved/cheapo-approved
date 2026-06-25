# Cheapo Approved Vision

## Mission

**Help shoppers spend less with almost no effort.**

Our purpose is simple:

> **Save Mike \$4 today.**

Every feature should help users make a better buying decision with less
work.

------------------------------------------------------------------------

# Product Vision

Cheapo Approved is not a product database.

It is a **decision engine**.

The app should answer questions like:

-   Is this a good price?
-   Should I buy it here?
-   Is there a better price nearby?
-   Is it worth driving somewhere else?
-   Should I wait for a better price?

------------------------------------------------------------------------

# Design Principles

## 1. The phone should figure it out.

Whenever possible:

-   GPS identifies the store.
-   Barcode identifies the product.
-   OCR reads the shelf price.
-   The user only confirms.

Typing should approach zero.

------------------------------------------------------------------------

## 2. Show decisions, not just data.

Don't simply display prices.

Tell the user what to do.

Examples:

-   Buy here.
-   Wait.
-   Better price nearby.
-   Lowest price this month.

------------------------------------------------------------------------

## 3. Save time before saving money.

The fastest experience usually wins.

Reduce taps.

Reduce typing.

Reduce thinking.

------------------------------------------------------------------------

## 4. Start focused.

Launch with alcohol.

Build the platform underneath.

The same engine can later support any UPC-based product.

------------------------------------------------------------------------

## 5. Context first.

The app should know:

-   Where am I shopping?
-   What product am I have in my hand?
-   What matters to me?

Everything else flows from those answers.

------------------------------------------------------------------------

# Engineering Rules

-   Read pricing from `deal_view`.
-   Keep the database normalized.
-   Minimize frontend complexity.
-   Prefer reusable components.
-   Build small, testable sprints.

------------------------------------------------------------------------

# Current Product Direction

Current focus:

1.  Favorite Stores
2.  Store Context
3.  Barcode Scanner
4.  OCR Price Capture
5.  GPS Auto Detect
6.  Price Submission
7.  Worth the Drive
8.  Price Score

------------------------------------------------------------------------

# Long-Term Vision

Eventually the home screen should proactively answer:

> "What should I buy today?"

Instead of making users search, the app should surface the best
opportunities automatically.

If a feature does not help users save money with less effort, it
probably does not belong.
