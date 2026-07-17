import React from "react";
import {
  Box, Button, Paper, TextField, Typography, MenuItem, Chip,
} from "@mui/material";
import { useSnackbar } from "notistack";
import WorkIcon from "@mui/icons-material/Work";
import PageView from "components/PageView";
import TabbedComponent from "components/TabbedComponent";
import PageSkeleton from "components/PageSkeleton";
import EmptyState from "components/EmptyState";
import { recruitmentApi } from "features/platform/api";
import RecruitmentPipeline from "./RecruitmentPipeline";

const STAGES = ["applied", "screening", "interview", "offer", "hired"];

export default function RecruitmentView() {
  const { enqueueSnackbar } = useSnackbar();
  const [jobs, setJobs] = React.useState([]);
  const [candidates, setCandidates] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [jobForm, setJobForm] = React.useState({ title: "", department: "", description: "" });
  const [candidateForm, setCandidateForm] = React.useState({
    jobId: "", name: "", email: "", phone: "",
  });
  const notesDebounce = React.useRef({});

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [jobsRes, candRes] = await Promise.all([
        recruitmentApi.jobs(),
        recruitmentApi.candidates({}),
      ]);
      setJobs(jobsRes?.jobs || []);
      setCandidates(candRes?.candidates || []);
    } catch (e) {
      enqueueSnackbar("Failed to load recruitment data.", { variant: "error" });
    }
    setLoading(false);
  }, [enqueueSnackbar]);

  React.useEffect(() => { load(); }, [load]);

  const handleCreateJob = async () => {
    const res = await recruitmentApi.createJob(jobForm);
    if (res?.success) {
      enqueueSnackbar("Job created.", { variant: "success" });
      setJobForm({ title: "", department: "", description: "" });
      load();
    } else {
      enqueueSnackbar(res?.error || "Failed.", { variant: "error" });
    }
  };

  const handleCreateCandidate = async () => {
    const res = await recruitmentApi.createCandidate(candidateForm);
    if (res?.success) {
      enqueueSnackbar("Candidate added.", { variant: "success" });
      setCandidateForm({ jobId: "", name: "", email: "", phone: "" });
      load();
    } else {
      enqueueSnackbar(res?.error || "Failed to add candidate.", { variant: "error" });
    }
  };

  const moveStage = async (candidateId, stage) => {
    const res = await recruitmentApi.updateStage(candidateId, { stage });
    if (res?.success) {
      if (stage === "hired") {
        const empId = res?.employeeId || res?.candidate?.employeeId;
        enqueueSnackbar(
          empId
            ? `Hired! Employee created (${empId}). Onboarding started.`
            : "Candidate hired — employee and onboarding created.",
          { variant: "success" },
        );
      }
      load();
    } else {
      enqueueSnackbar(res?.error || "Stage update failed.", { variant: "error" });
    }
  };

  const handleRate = async (candidateId, rating) => {
    await recruitmentApi.updateCandidate(candidateId, { rating });
    setCandidates((prev) =>
      prev.map((c) => (c._id === candidateId ? { ...c, rating } : c)),
    );
  };

  const handleEditNotes = (candidateId, notes, persist) => {
    setCandidates((prev) =>
      prev.map((c) => (c._id === candidateId ? { ...c, notes } : c)),
    );
    if (!persist) return;
    clearTimeout(notesDebounce.current[candidateId]);
    notesDebounce.current[candidateId] = setTimeout(async () => {
      await recruitmentApi.updateCandidate(candidateId, { notes });
    }, 500);
  };

  const tabs = [
    {
      label: "Jobs",
      panel: (
        <Box>
          <Paper style={{ padding: 16, marginBottom: 16 }}>
            <Typography variant="subtitle1" gutterBottom>Post a job</Typography>
            <Box display="flex" flexWrap="wrap" gridGap={12} alignItems="flex-end">
              <TextField label="Title" size="small" value={jobForm.title}
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} />
              <TextField label="Department" size="small" value={jobForm.department}
                onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })} />
              <TextField label="Description" size="small" value={jobForm.description}
                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} style={{ minWidth: 200 }} />
              <Button variant="contained" color="primary" onClick={handleCreateJob}>Save job</Button>
            </Box>
          </Paper>
          {jobs.length === 0 ? (
            <EmptyState title="No open jobs" description="Create a job posting to start your pipeline." />
          ) : (
            jobs.map((j) => (
              <Paper key={j._id} style={{ padding: 12, marginBottom: 8 }} variant="outlined">
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography variant="subtitle1">{j.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {j.department || "—"}
                    </Typography>
                  </Box>
                  <Chip label={j.status || "open"} size="small" color="primary" />
                </Box>
              </Paper>
            ))
          )}
        </Box>
      ),
    },
    {
      label: "Pipeline",
      panel: (
        <Box>
          <Paper style={{ padding: 16, marginBottom: 16 }}>
            <Typography variant="subtitle1" gutterBottom>Add candidate</Typography>
            <Box display="flex" flexWrap="wrap" gridGap={12} alignItems="flex-end">
              <TextField select label="Job" size="small" value={candidateForm.jobId}
                onChange={(e) => setCandidateForm({ ...candidateForm, jobId: e.target.value })} style={{ minWidth: 160 }}>
                {jobs.map((j) => (
                  <MenuItem key={j._id} value={j._id}>{j.title}</MenuItem>
                ))}
              </TextField>
              <TextField label="Name" size="small" value={candidateForm.name}
                onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })} />
              <TextField label="Email" size="small" value={candidateForm.email}
                onChange={(e) => setCandidateForm({ ...candidateForm, email: e.target.value })} />
              <Button variant="contained" color="primary" onClick={handleCreateCandidate}>Add</Button>
            </Box>
          </Paper>
          {candidates.length === 0 ? (
            <EmptyState title="Pipeline empty" description="Add candidates and drag cards between stages." />
          ) : (
            <RecruitmentPipeline
              stages={STAGES}
              candidates={candidates}
              onMoveStage={moveStage}
              onRate={handleRate}
              onEditNotes={handleEditNotes}
            />
          )}
        </Box>
      ),
    },
  ];

  return (
    <PageView title="Recruitment (ATS)" icon={<WorkIcon fontSize="large" />} backPath="/app/dashboard" breadcrumbs>
      {loading ? <PageSkeleton showTitle={false} showActions={false} contentRows={4} /> : (
        <TabbedComponent tabs={tabs} />
      )}
    </PageView>
  );
}
