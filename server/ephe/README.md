# Ephemeris Data Files

This directory should contain Swiss Ephemeris data files for accurate calculations.

## Required Files

Download the following files from https://www.astro.com/ftp/swisseph/ephe/:

- `sepl*.se1` - Planet data files
- `semo*.se1` - Moon data files
- `seas*.se1` - Asteroid data files (optional)

## For Basic Usage

The minimum required files for accurate calculations:

```
sepl_18.se1   # Planets 1800-2400 AD
semo_18.se1   # Moon 1800-2400 AD
```

## Download Script

You can download the essential files using:

```bash
curl -O https://www.astro.com/ftp/swisseph/ephe/sepl_18.se1
curl -O https://www.astro.com/ftp/swisseph/ephe/semo_18.se1
```

**Note**: The `sweph` npm package includes built-in ephemeris data for a limited date range. External files extend the calculation accuracy and date range.
