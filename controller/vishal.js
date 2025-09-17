function sum(a, b) {
    const result = a + b;
    console.log(`insert called with a=${a}, b=${b}, result=${result}`);
    return result;
}

module.exports = {
    sum
};