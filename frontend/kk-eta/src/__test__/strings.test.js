const stringTests = require("./strings.js");
const testAddress = "290 Bremner Blvd TORONTO ON M5V 3L9";
const testAddress2 = "290 Bremner Blvd TORONTOON M5V 3L9";

test("Parse: " + testAddress, () => {
    expect(stringTests.parseAddress(testAddress)).toBe("290 Bremner Blvd Toronto ON M5V 3L9");
})

test("Parse: " + testAddress2, () => {
    expect(stringTests.parseAddress(testAddress2)).toBe("290 Bremner Blvd Toronto ON M5V 3L9");
})