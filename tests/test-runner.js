/**
 * test-runner.js
 * Minimal test framework — no external dependencies.
 */

const TestRunner = (() => {
  const suites = [];
  let _current = null;

  function describe(name, fn) {
    _current = { name, tests: [] };
    suites.push(_current);
    try { fn(); } catch (e) {
      _current.tests.push({ name: "(erro de setup)", passed: false, error: e.message });
    }
    _current = null;
  }

  function it(name, fn) {
    const test = { name, passed: false, error: null };
    _current?.tests.push(test);
    try { fn(); test.passed = true; }
    catch (e) { test.error = e.message; }
  }

  function expect(actual) {
    const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

    return {
      toBe(expected) {
        assert(actual === expected,
          `esperado: ${JSON.stringify(expected)}\nrecebido: ${JSON.stringify(actual)}`);
      },
      toBeCloseTo(expected, digits = 2) {
        const m = Math.pow(10, digits);
        assert(Math.round(actual * m) === Math.round(expected * m),
          `esperado: ~${expected}\nrecebido: ${actual}`);
      },
      toBeGreaterThan(n) {
        assert(actual > n, `esperado: > ${n}\nrecebido: ${actual}`);
      },
      toBeLessThan(n) {
        assert(actual < n, `esperado: < ${n}\nrecebido: ${actual}`);
      },
      toBeGreaterThanOrEqual(n) {
        assert(actual >= n, `esperado: >= ${n}\nrecebido: ${actual}`);
      },
      toBeTruthy() {
        assert(!!actual, `esperado: truthy\nrecebido: ${JSON.stringify(actual)}`);
      },
      toBeFalsy() {
        assert(!actual, `esperado: falsy\nrecebido: ${JSON.stringify(actual)}`);
      },
      toHaveLength(n) {
        assert(actual?.length === n,
          `esperado comprimento: ${n}\nrecebido: ${actual?.length}`);
      },
      toContain(item) {
        assert(actual?.includes?.(item),
          `esperado: conter ${JSON.stringify(item)}`);
      },
      toBeNull() {
        assert(actual === null, `esperado: null\nrecebido: ${JSON.stringify(actual)}`);
      },
    };
  }

  function run() {
    let passed = 0, failed = 0;
    suites.forEach(s => s.tests.forEach(t => t.passed ? passed++ : failed++));
    renderResults(suites, passed, failed);
  }

  function renderResults(suites, passed, failed) {
    const total = passed + failed;
    const pct = total > 0 ? Math.round(passed / total * 100) : 0;
    const allPass = failed === 0;

    document.getElementById("summary").innerHTML = `
      <div class="summary-box ${allPass ? "all-pass" : "has-fail"}">
        <span class="summary-score">${passed}/${total}</span>
        <span class="summary-label">testes passaram (${pct}%)</span>
        ${!allPass ? `<span class="summary-fail-badge">${failed} falha${failed > 1 ? "s" : ""}</span>` : "✅ Tudo ok!"}
      </div>`;

    document.getElementById("results").innerHTML = suites.map(suite => {
      const sPass = suite.tests.filter(t => t.passed).length;
      const sFail = suite.tests.filter(t => !t.passed).length;
      return `
        <div class="suite">
          <div class="suite-header ${sFail === 0 ? "suite-ok" : "suite-err"}">
            <span>${sFail === 0 ? "✅" : "❌"}</span>
            <span class="suite-name">${suite.name}</span>
            <span class="suite-count">${sPass}/${suite.tests.length}</span>
          </div>
          <div class="suite-tests">
            ${suite.tests.map(t => `
              <div class="test ${t.passed ? "pass" : "fail"}">
                <span class="test-icon">${t.passed ? "✓" : "✗"}</span>
                <span class="test-name">${t.name}</span>
                ${t.error ? `<pre class="test-error">${t.error}</pre>` : ""}
              </div>`).join("")}
          </div>
        </div>`;
    }).join("");
  }

  return { describe, it, expect, run };
})();

/* Expose as globals for cleaner test syntax */
const { describe, it, expect } = TestRunner;
