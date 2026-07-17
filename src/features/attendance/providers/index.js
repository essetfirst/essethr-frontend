import { useContext } from 'react'
import Context from "./Context";

export { default as Provider } from './Provider'

export default function useAttendance() {
  const ctx = useContext(Context);
  return ctx ?? { state: { attendanceByDate: {} }, fetchAttendance: () => {} };
}