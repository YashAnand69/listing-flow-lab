import assert from "node:assert/strict";
import test from "node:test";
import { blankListing, restoreDraft, runScenarios, sampleListing, saveDraft, validate } from "./model.ts";

test("sample listing is ready and blank listing is not", () => {
  assert.deepEqual(validate(sampleListing), {});
  assert.ok(Object.keys(validate(blankListing)).length >= 4);
});
test("offer must be strictly below price", () => {
  assert.ok(validate({ ...sampleListing, minimumOffer: sampleListing.price }).minimumOffer);
  assert.equal(validate({ ...sampleListing, minimumOffer: "774.99" }).minimumOffer, undefined);
});
test("own shipping label does not require dimensions", () => {
  assert.deepEqual(validate({ ...sampleListing, shipping: "own", weight: "", length: "", width: "", height: "" }), {});
});
test("draft restore accepts only versioned, complete data", () => {
  assert.deepEqual(restoreDraft(saveDraft(sampleListing)), sampleListing);
  assert.equal(restoreDraft("{bad json"), null);
  assert.equal(restoreDraft(JSON.stringify({ version: 2, listing: sampleListing })), null);
  assert.equal(restoreDraft(JSON.stringify({ version: 1, listing: { ...sampleListing, price: 775 } })), null);
});
test("all synthetic release checks match their expectation", () => {
  assert.ok(runScenarios().every((scenario) => scenario.passed));
});
