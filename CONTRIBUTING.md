# Contributing

Thanks for helping makers find where to launch. Every place is one JSON file. Open a pull request
that adds or edits a file in `places/`. A check validates it, a maintainer reviews it, and once
it's merged the place shows up on [indiegoodies.com/where-to-launch](https://indiegoodies.com/where-to-launch).

Not comfortable editing JSON? [Suggest a place with the form](../../issues/new/choose) instead.

## Before you start

By contributing, you agree to the terms in [LICENSE](LICENSE): your contribution may be used by the
maintainers, and the data may not be reused elsewhere.

## What belongs here

A site, community or list where makers can launch, list or share a product, that is active and
has a real audience. Not accepted: link farms, paid-only backlink schemes, and sites that are down
or haven't been updated in a year.

## Add a place

Create `places/<slug>.json`. The slug is the name in lowercase words joined by hyphens
(`product-hunt`, `r-sideproject`). Search `places/` first to make sure it isn't already listed.

```json
{
  "name": "Product Hunt",
  "url": "https://www.producthunt.com",
  "description": "The best new products in tech, launched and voted on every day",
  "category": "launch",
  "icon": "https://www.producthunt.com/icon.png"
}
```

| Field | |
|---|---|
| `name` | Required. |
| `url` | Required. `https://` link to the place. No affiliate links. |
| `description` | Required. What it is and who it reaches, one line, up to 160 characters, no trailing period. |
| `category` | Required. One slug from the table below. |
| `pricing` | Optional. `freemium` (free with paid upgrades) or `paid`. Leave it out when listing is free. |
| `icon` | Optional. A direct `https://` link to a square logo. |

Use 2-space indent, the key order shown above, and a trailing newline.

### Categories

| Slug | Name |
|---|---|
| `launch` | Launch Platforms |
| `communities` | Communities |
| `reddit` | Reddit |
| `directories` | Directories |
| `deals` | Deals |
| `marketplaces` | Marketplaces |

## Check locally

With Node 24:

```
npm ci
npm run validate
```
