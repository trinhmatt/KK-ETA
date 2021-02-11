import { __esModule } from "@mui-treasury/components/content/textInfo/TextInfoContent";

module.exports.parseAddress = (addressStr) => {
    let address = addressStr;

    /*
      To check if ON has a space before and after it, we need to make sure
      the city is not spelled TORONTO
    */
    const indexOfTORONTO = address.indexOf("TORONTO");

    if (indexOfTORONTO > 0) {
      address = address.replace("TORONTO", "Toronto");
      //console.log(allCustomers[i].address);
    }

    //Need to check if there is a space before "ON"
    //The address will be wrong (and so will the route) is there is
    let provIndex = address.indexOf("ON");

    if (address.charAt(provIndex - 1) !== " ") {

      //If it is, add a space before it
      address = address.substring(0, provIndex) +
        " " +
        address.substring(provIndex, address.length);
    }

    //Check if there is a space after "ON"

    //Need to fetch the index again if it was changed above
    provIndex = address.indexOf("ON");

    if (address.charAt(provIndex + 2) !== " ") {

      address = address.substring(0, provIndex + 2) +
        " " +
        address.substring(provIndex + 2, address.length);
    }

    return address;
}