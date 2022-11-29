class BarcodeScanner {
  initialize = () => {
    window.addEventListener("keypress", this.keyup);
    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler);
    }
    this.timeoutHandler = setTimeout(() => {
      this.inputString = "";
    }, 20);
  };

  close = () => {
    window.removeEventListener("keypress", this.keyup);
  };

  timeoutHandler = 0;

  inputString = "";

  keyup = (e) => {
    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler);
      this.inputString += String.fromCharCode(e.keyCode);
    }

    this.timeoutHandler = setTimeout(() => {
      if (this.inputString.length <= 3) {
        this.inputString = "";
        return;
      }

      window.dispatchEvent(
        new CustomEvent("barcodescanned", {
          bubbles: true,
          detail: { code: this.inputString },
        })
      );

      this.inputString = "";
    }, 20);
  };
}

export default BarcodeScanner;
