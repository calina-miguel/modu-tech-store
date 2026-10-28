# MODU Tech Shopify theme

Interactive build guide: https://calina-miguel.github.io/modu-tech-store/guide/

This is a new tech accessories storefront built on Shopify's free Dawn Liquid theme. The visual identity, homepage sections, CSS, and motion script are original to this project. No paid animation library, font, image, or theme component is required.

## What works once installed on a Shopify store

- Responsive homepage with editable editorial hero and benefits.
- Native Dawn product, variant, collection, filtering, search, cart drawer, localization, and checkout flow.
- Featured products are drawn from the `all` collection by default. Add real products in Shopify admin.
- Scroll reveal, floating device visual, CSS parallax, hover motion, and discrete mouse-wheel easing.
- Reduced-motion setting disables motion. Touchpad gestures, touch input, keyboard scrolling, and nested cart scrolling remain native.

## Install and finish the store

1. Create a Shopify store named MODU Tech, or provide collaborator access to an existing new store.
2. Upload `modu-tech-theme.zip` in Online Store > Themes > Add theme > Upload zip file. Keep it unpublished while configuring.
3. Add real tech products with licensed photos, descriptions, variants, prices, inventory, weights, and fulfillment details. Do not publish placeholder products as real inventory.
4. Create collections for Desk, Charging, and Travel, then assign the main menu. Select a featured collection in the theme editor.
5. Edit the homepage hero links and copy, add policies and contact details, and review the mobile layout in the Shopify theme editor.
6. Configure payments, tax registrations, shipping profiles, markets, and local currencies in Shopify admin. These are merchant account settings, not theme code.
7. Run test orders for variants, shipping destinations, taxes, discounts, and payment methods before publishing.

The theme is free, but Shopify's live commerce plan and payment processing are not free. A Shopify Liquid theme runs on Shopify, not Vercel or GitHub Pages. Without buying a domain, the live Shopify URL will end in `.myshopify.com`, never `chatgpt.site`. Vercel can host a separate static preview or headless frontend, but it cannot execute this Liquid theme.

The current workspace does not contain Shopify credentials, a product catalog, merchant details, or a Vercel project. This package is a functional theme, not a live store. These inputs are required to complete a sellable launch.
