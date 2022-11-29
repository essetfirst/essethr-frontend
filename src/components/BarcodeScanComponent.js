import React from "react";
import PropTypes from "prop-types";

import BarcodeScanner from "../../helpers/barcode-scanner";

const BarcodeScanComponent = ({ onBarcodeScanned }) => {
  const [scanned, setScanned] = React.useState("");

  React.useEffect(() => {
    const barcode = new BarcodeScanner();
    barcode.initialize();
    return () => {
      barcode.close();
    };
  }, []);

  React.useEffect(
    () => {
      const scanHandler = (e) => {
        setScanned(e.barcode);
        // onBarcodeScanned(e.barcode);
      };

      window.addEventListener("barcodescanned", scanHandler);
      return () => {
        window.removeEventListener("barcodescanned", scanHandler);
      };
    },
    [
      // onBarcodeScanned,
      /* here put dependencies for your scanHandler ;) */
    ]
  );
  return <div>{scanned}</div>;
};

BarcodeScanComponent.propTypes = {
  onBarcodeScanned: PropTypes.func,
};

BarcodeScanComponent.defaultProps = {
  onBarcodeScanned: (_) => {},
};

export default BarcodeScanComponent;
