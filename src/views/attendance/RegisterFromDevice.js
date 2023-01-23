import React from "react";

import { useSnackbar } from "notistack";
import UIfx from "uifx";

import API from "../../api";

import useOrg from "../../providers/org";
import useNotificationSnackbar from "../../providers/notification-snackbar";

import WelcomeAudio from "../../assets/audios/welcome.mp3";
import GoodbyeAudio from "../../assets/audios/goodbye.mp3";
import ErrorAudio from "../../assets/audios/failure.mp3";
// import SevereErrorAudio from '../../assets/audios/severe.mp3';

const welcomeTrack = new UIfx(WelcomeAudio, { volume: 0.8, throttleMs: 100 });
const goodbyeTrack = new UIfx(GoodbyeAudio, { volume: 0.8, throttleMs: 100 });
const errorTrack = new UIfx(ErrorAudio, { volume: 0.8, throttleMs: 100 });
// const severeErrorTrack = new UIfx(SevereErrorAudio, { volume: 0.8, throttleMs: 100 })

const RegisterFromDevice = ({ onRefresh }) => {
  const { org } = useOrg();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { notificationSnackbar } = useNotificationSnackbar();
  const notify = notificationSnackbar(enqueueSnackbar, closeSnackbar);

  const handleBarcodeScan = React.useCallback(
    (e) => {
      const employeeId = e.detail.code;
      const time = e.detail.time || Date.now();
      if (employeeId !== "Enter") {
        const employees = org ? org.employees : [];
        const stdEmployeeId = parseInt(String(employeeId).replace(/Enter/, ""));
        // if (
        //   !(
        //     employees.filter((emp) => emp.employeeId === stdEmployeeId).length >
        //     0
        //   )
        // ) {
        //   console.log("We are inside handler!");
        //   // TODO: play error track
        //   errorTrack.play();
        //   notify({
        //     success: false,
        //     error: "Employee not recognized!",
        //   });
        //   return;
        // }
        const { firstName, surName } =
          employees.filter((e) => e.employeeId === stdEmployeeId)[0] || {};
        const register = () => {
          API.attendance
            .swipe({
              employeeName: `${firstName} ${surName}`,
              employeeId: stdEmployeeId,
              time: time || Date.now(),
              device: "Card Reader",
            })
            .then(({ success, message, action, error, ...rest }) => {
              if (success) {
                if (action === "checkin" || action === "breakin") {
                  welcomeTrack.play();
                } else if (action === "checkout") {
                  goodbyeTrack.play();
                } else {
                  // do nothing
                }
                // update attendance after checkin/checkout
                typeof onRefresh === "function" && onRefresh();
              } else {
                errorTrack.play();
              }

              // showNotification({ success, message, error });
              notify({ success, message, error });
            })
            .catch((e) => {
              // console.warn(e.message);

              notify({
                success: false,
                severe: true,
                error:
                  String(e).includes("Unexpected token P") ||
                  String(e).includes("JSON.parse")
                    ? "Something went wrong. Please check connection and retry."
                    : String(e),
                retry: register,
              });
            });
        };
        register();
        // }
      }
    },
    [org, notify, onRefresh]
  );

  React.useEffect(() => {
    window.addEventListener("barcodescanned", handleBarcodeScan);
    // const swipeInterval = setInterval(() => {
    //   if (org) {
    //     const index = parseInt(
    //       (Math.random() * 10) % ((org.employees || {}).length || 1)
    //     );
    //     // console.log("Generated index: ", index);
    //     const { employeeId = 0 } =
    //       org && org.employees && org.employees.length > 0
    //         ? org.employees[index]
    //         : {};
    //     window.dispatchEvent(
    //       new CustomEvent("barcodescanned", {
    //         bubbles: true,
    //         detail: {
    //           code: employeeId,
    //           time: Date.now() + ((Math.random() * 10) % 10) * 3600000 * 24,
    //         },
    //       })
    //     );
    //   }
    // }, 5000);

    return () => {
      window.removeEventListener("barcodescanned", handleBarcodeScan);
      // clearInterval(swipeInterval);
    };
  }, [org, handleBarcodeScan]);

  return <></>;
};

export default RegisterFromDevice;
