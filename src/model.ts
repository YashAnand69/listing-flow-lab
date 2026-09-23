export type Category = "Gaming PC" | "GPU";
export type Shipping = "platform" | "own";
export type Condition = "New in box" | "Open box" | "Used, like new" | "Used, good" | "For parts";

export type Listing = {
  category: Category;
  title: string;
  condition: Condition;
  price: string;
  quantity: string;
  photoCount: string;
  offers: boolean;
  minimumOffer: string;
  shipping: Shipping;
  weight: string;
  length: string;
  width: string;
  height: string;
};

export type Field = keyof Listing;
export type Issues = Partial<Record<Field, string>>;

export const blankListing: Listing = {
  category: "Gaming PC", title: "", condition: "Used, good", price: "", quantity: "1",
  photoCount: "0", offers: false, minimumOffer: "", shipping: "platform",
  weight: "", length: "", width: "", height: "",
};

export const sampleListing: Listing = {
  category: "Gaming PC", title: "Custom Ryzen gaming PC with RTX graphics", condition: "Used, good",
  price: "775", quantity: "1", photoCount: "5", offers: true, minimumOffer: "650",
  shipping: "platform", weight: "24", length: "22", width: "20", height: "12",
};

const finitePositive = (value: string) => value.trim() !== "" && Number.isFinite(Number(value)) && Number(value) > 0;

export function validate(listing: Listing): Issues {
  const issues: Issues = {};
  if (listing.title.trim().split(/\s+/).filter(Boolean).length < 5) issues.title = "Use at least five words so the item is identifiable.";
  if (!finitePositive(listing.price)) issues.price = "Enter a price above $0.";
  if (!Number.isInteger(Number(listing.quantity)) || Number(listing.quantity) < 1 || Number(listing.quantity) > 99) issues.quantity = "Quantity must be a whole number from 1 to 99.";
  if (!Number.isInteger(Number(listing.photoCount)) || Number(listing.photoCount) < 1) issues.photoCount = "Add at least one product photo.";
  if (listing.offers && (!finitePositive(listing.minimumOffer) || Number(listing.minimumOffer) >= Number(listing.price))) {
    issues.minimumOffer = "Minimum offer must be above $0 and below the listing price.";
  }
  if (listing.shipping === "platform") {
    for (const field of ["weight", "length", "width", "height"] as const) {
      if (!finitePositive(listing[field])) issues[field] = "Required for a shipping label.";
    }
    if (!issues.weight && Number(listing.weight) > 150) issues.weight = "This sample label flow caps weight at 150 lb.";
    if (!issues.length && Number(listing.length) > 107) issues.length = "This sample label flow caps length at 107 in.";
  }
  return issues;
}

export function status(listing: Listing) {
  const issues = validate(listing);
  const count = Object.keys(issues).length;
  return { issues, count, ready: count === 0 };
}

const categories: Category[] = ["Gaming PC", "GPU"];
const conditions: Condition[] = ["New in box", "Open box", "Used, like new", "Used, good", "For parts"];

export function restoreDraft(raw: string | null): Listing | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !("version" in parsed) || parsed.version !== 1 || !("listing" in parsed)) return null;
    const listing = parsed.listing;
    if (!listing || typeof listing !== "object") return null;
    const value = listing as Record<string, unknown>;
    if (!categories.includes(value.category as Category) || !conditions.includes(value.condition as Condition)) return null;
    if (value.shipping !== "platform" && value.shipping !== "own") return null;
    if (typeof value.offers !== "boolean") return null;
    for (const field of ["title", "price", "quantity", "photoCount", "minimumOffer", "weight", "length", "width", "height"]) {
      if (typeof value[field] !== "string") return null;
    }
    return value as Listing;
  } catch { return null; }
}

export const saveDraft = (listing: Listing) => JSON.stringify({ version: 1, listing });

export const scenarios = [
  { label: "Complete listing", description: "Buyer-facing basics and label dimensions", listing: sampleListing, expectedReady: true },
  { label: "Missing photos", description: "Stops a listing without product images", listing: { ...sampleListing, photoCount: "0" }, expectedReady: false },
  { label: "Offer above price", description: "Rejects a contradictory minimum offer", listing: { ...sampleListing, minimumOffer: "850" }, expectedReady: false },
  { label: "Oversized parcel", description: "Flags the public 150 lb label limit", listing: { ...sampleListing, weight: "151" }, expectedReady: false },
  { label: "Seller's own label", description: "Does not demand platform-label dimensions", listing: { ...sampleListing, shipping: "own" as const, weight: "", length: "", width: "", height: "" }, expectedReady: true },
];

export function runScenarios() {
  return scenarios.map((scenario) => {
    const result = status(scenario.listing);
    return { ...scenario, actualReady: result.ready, passed: result.ready === scenario.expectedReady, issues: result.issues };
  });
}
