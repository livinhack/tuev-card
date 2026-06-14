# TÜV Card

Home Assistant Lovelace card for vehicles tracked by the **TÜV Reminder** integration.

The card shows your vehicles with TÜV/HU status, next inspection date, TÜV sticker, optional graphical German-style license plates, sorting, and optional groups.

## Features

- Shows one or multiple TÜV Reminder vehicles
- TÜV/HU sticker with month/year display
- Due and expired vehicles can be confirmed directly from the card
- Optional graphical German-style license plates
- Visual editor with localized UI
- Columns: automatic, 1, 2, 3, or 4
- Sorting by name, plate, due date, or status
- Optional vehicle groups with colors, sorting, and display settings
- Optional small groups side by side when enough space is available
- Button to add all available TÜV entities to the card configuration

## Requirements

- Home Assistant
- TÜV Reminder sensor entities
- HACS or manual Lovelace resource setup

## Installation

### HACS

Install the card through HACS.

If the Lovelace resource is not added automatically, add this resource:

```yaml
url: /hacsfiles/tuev-card/tuev-card.js
type: module
```

After installing or updating, reload the dashboard. In the Home Assistant app or browser, a full reload may be needed before the updated card appears.

### Manual installation

Copy the contents of the `dist` folder to:

```text
/config/www/community/tuev-card/
```

Add this Lovelace resource:

```yaml
url: /local/community/tuev-card/tuev-card.js
type: module
```

## Add the card

Use the Home Assistant card picker and select:

```text
TÜV Reminder
```

Or add it manually:

```yaml
type: custom:tuev-card
entity: sensor.your_vehicle_tuv
```

Multiple vehicles:

```yaml
type: custom:tuev-card
columns: auto
sort: name
show_badge: true
show_details: true
entities:
  - sensor.focus_rs_tuv
  - sensor.focus_st_tuv
  - sensor.mondeo_tuv
```

Grouped vehicles:

```yaml
type: custom:tuev-card
columns: auto
groups_layout: auto
groups:
  - title: Private
    color: "#42a5f5"
    entities:
      - sensor.focus_rs_tuv
      - sensor.mondeo_tuv
  - title: Company
    color: "#66bb6a"
    entities:
      - sensor.transit_tuv
entities:
  - sensor.unassigned_trailer_tuv
```

## Visual editor

The visual editor supports:

- selecting TÜV entities
- adding all new TÜV vehicles at once
- column limit
- sorting for ungrouped vehicles and groups
- showing or hiding details
- showing or hiding the TÜV sticker
- graphical license plates
- optional vehicle groups with freely named headings
- group colors
- manual group ordering
- group-specific display settings via the round eye button in the group header

The native Home Assistant editor preview can be narrower than the final dashboard card. The final dashboard uses the real available card width.

## HU confirmation

When a vehicle is due or expired, the card shows a stamp-style HU confirmation overlay. Click the green `HU passed?` / `HU bestanden?` stamp to confirm a passed inspection.

The card then runs the `tuev_reminder.confirm_passed` service of the TÜV Reminder integration.

## Options

| Option | Default | Description |
| --- | --- | --- |
| `entity` | optional | Single TÜV Reminder sensor |
| `entities` | optional | List of ungrouped TÜV Reminder sensors |
| `groups` | optional | Vehicle groups with title, entity list, optional color, sorting, and display settings |
| `groups_layout` | `stacked` | `stacked` or `auto`; `auto` can place small groups side by side when each involved group has at most two vehicles and enough width is available |
| `columns` | `auto` | `auto`, `1`, `2`, `3`, or `4`; treated as a maximum |
| `sort` | `name` | Ungrouped sorting: `name`, `plate`, `due_date`, or `status` |
| `sort_direction` | `asc` | Ungrouped sort direction: `asc` or `desc` |
| `show_badge` | `true` | Show the TÜV sticker |
| `show_details` | `true` | Show next HU and status |
| `plate_style` | `text` | `text` or `plate` |

Group display settings can override some global display settings for a group:

```yaml
groups:
  - id: daily
    title: Daily cars
    display:
      columns: "2"
      show_badge: false
      show_details: true
```

`columns: auto` uses as many readable columns as fit. Manual values `1` to `4` act as maximums and may be reduced automatically if the available width is too small.

## Notes

- The TÜV sticker itself does not need external fonts.
- Code, file names, and internal functions are kept in English.
- User-facing text is localized through the card translations.
