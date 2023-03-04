/** @jest-environment jsdom */

// const React = require('react');
// import '@testing-library/jest-dom';

describe("Function Tests", function () {
  test("Should produce the expected sum", () => {
    var two = 3;
    expect(two + 2).toEqual(5);
  });
});