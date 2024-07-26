// function convertAmountToBigInt(amount: string, decimals: number) {
//   // Convert the amount to a string and remove any non-numeric characters
//   // const amountString = amount.toString().replace(/[^0-9.]/g, '');

//   // Split the amount into integer and decimal parts
//   const [integerPart, decimalPart] = amount.split('.');

//   // Calculate the integer value of the amount without decimals
//   let integerAmount = BigInt(integerPart.padEnd(decimals + 1, '0'));

//   // If there is a decimal part, convert it to the appropriate value based on token decimals
//   if (decimalPart) {
//     const decimalValue = BigInt(decimalPart.padEnd(decimals + 1, '0').slice(0, decimals));
//     integerAmount = integerAmount + decimalValue;
    
//   }

//   return integerAmount;
// }
function convertAmountToBigInt(amount: string, decimals: number): BigInt {
  // Split the amount into integer and decimal parts
  const [integerPart, decimalPart = ""] = amount.split('.');

  // Convert the integer part directly to BigInt and multiply by the base (10 ** decimals)
  let result = BigInt(integerPart) * BigInt(10 ** decimals);

  // If there is a decimal part, add it to the result
  if (decimalPart.length > 0) {
    // Ensure the decimal part is not longer than the decimals count
    const adjustedDecimalPart = decimalPart.slice(0, decimals).padEnd(decimals, '0');
    result += BigInt(adjustedDecimalPart);
  }

  return result;
}


function convertBigIntToAmount(bigIntAmount: BigInt, decimals: number): number {
  // Convert the BigInt amount to a string
  const amountString = bigIntAmount.toString();

  // Calculate the number of digits in the integer part
  return Number(amountString) / Math.pow(10, decimals);

  // // Split the amount into integer and decimal parts
  // let integerPart = amountString.slice(0, integerDigits) || '0';
  // let decimalPart = amountString.slice(integerDigits);
  // console.log('convert integerPart', integerPart)
  // console.log('convert decimalPart 1', decimalPart);

  // // Add leading zeros to the decimal part if necessary
  // decimalPart = decimalPart.padStart(decimals, '0');
  // console.log('convert decimalPart 2', decimalPart);

  // // Construct the decimal representation of the amount
  // let amount = `${integerPart}.${decimalPart}`;

  // // Remove trailing zeros and decimal point if the decimal part is empty
  // if (decimalPart === '0') {
  //   amount = integerPart;
  // } else {
  //   amount = amount.replace(/\.?0*$/, '');
  // }

  // return amount;
}

function convertBigIntToAmount2(bigIntAmount: BigInt, decimals: number) {
  // Convert the BigInt amount to a string
  const amountString = bigIntAmount.toString();

  // Calculate the number of digits in the integer part
  const integerDigits = amountString.length - decimals;

  // Split the amount into integer and decimal parts
  let integerPart = amountString.slice(0, integerDigits) || '0';
  let decimalPart = amountString.slice(integerDigits);

  // Add leading zeros to the decimal part if necessary
  decimalPart = decimalPart.padStart(decimals, '0');

  // Construct the decimal representation of the amount
  let amount = `${integerPart}.${decimalPart}`;

  // Remove trailing zeros and decimal point if the decimal part is empty
  if (decimalPart === '0') {
    amount = integerPart;
  } else {
    amount = amount.replace(/\.?0*$/, '');
  }

  return +amount;
}

function formatWeiAmount(amount: string, decimals: number) {
  return Number(amount) / Math.pow(10, decimals ?? 0);
}

export {
  convertAmountToBigInt,
  convertBigIntToAmount,
  formatWeiAmount,
}