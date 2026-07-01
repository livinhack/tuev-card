#!/usr/bin/env node
import { REGRESSION_CASES, evaluateRegressionCase } from "../src/plate/regression-cases.js";

const results = REGRESSION_CASES.map((test) => ({ test, result: evaluateRegressionCase(test) }));
const failed = results.filter(({ result }) => !result.ok);

for (const { test, result } of results) {
  const status = result.ok ? "OK" : "FAIL";
  console.log(`${status.padEnd(4)} ${test.id.padEnd(28)} ${result.detail}`);
}

if (failed.length) {
  console.error(`\nRegression failed: ${failed.length}/${results.length} cases have issues.`);
  process.exit(1);
}

console.log(`\nRegression passed: ${results.length}/${results.length} cases OK.`);
