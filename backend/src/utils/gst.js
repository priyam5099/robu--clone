/**
 * Prices on Robu are inclusive of GST.
 * Formula to extract GST: GST Amount = Price - (Price * 100 / (100 + GST%))
 */
const calculateGST = (totalPrice, gstPercent = 18) => {
  const priceExcludingGST = totalPrice / (1 + gstPercent / 100);
  const gstAmount = totalPrice - priceExcludingGST;
  
  return {
    priceExcludingGST: Number(priceExcludingGST.toFixed(2)),
    gstAmount: Number(gstAmount.toFixed(2)),
    priceIncludingGST: Number(totalPrice.toFixed(2))
  };
};

module.exports = { calculateGST };