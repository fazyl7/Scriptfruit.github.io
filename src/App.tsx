import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  CssBaseline,
  Button,
  Stack,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  FormControl,
  InputLabel,
  Select,
  Grid,
} from "@mui/material";
import { Brightness4, Brightness7, RestartAlt, Add } from "@mui/icons-material";
import { ThemeProvider } from "@mui/material/styles";
import { makeTheme } from "./utils/theme";
import AttendanceCard from "./components/AttendanceCard";
import { mockCourses, courseCatalog } from "./data/mockData";
import type { Course } from "./utils/types";
import { attendanceStatus } from "./utils/attendance";

const COURSES_KEY = "attendance.courses";
const THEME_KEY = "attendance.theme";

export default function App() {
  // --- State ---
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [group, setGroup] = useState("");

  const [mode, setMode] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === "dark" || stored === "light" ? stored : "light";
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const stored = localStorage.getItem(COURSES_KEY);
    return stored ? (JSON.parse(stored) as Course[]) : mockCourses;
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "safe" | "warning" | "critical"
  >("all");

  const [openDialog, setOpenDialog] = useState(false);
  const [newCourse, setNewCourse] = useState<Course>({
    id: "",
    name: "",
    attended: 0,
    total: 0,
  });


  useEffect(() => {
    localStorage.setItem(THEME_KEY, mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  }, [courses]);


  const theme = useMemo(() => makeTheme(mode), [mode]);
  const toggleMode = () =>
    setMode((m) => (m === "light" ? "dark" : "light"));

  // --- Course update
  const updateCourse = (id: string, deltaAttended: number, deltaTotal: number) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              attended: Math.max(0, c.attended + deltaAttended),
              total: Math.max(0, c.total + deltaTotal),
            }
          : c
      )
    );
  };

  const markPresent = (id: string) => updateCourse(id, +1, +1);
  const markAbsent = (id: string) => updateCourse(id, 0, +1);
  const deleteCourse = (id: string) =>
    setCourses((prev) => prev.filter((c) => c.id !== id));
  const resetAll = () => setCourses(mockCourses);

  // Search ---
  const filteredCourses = courses.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all"
        ? true
        : attendanceStatus(c.attended, c.total) === filter;
    return matchSearch && matchFilter;
  });

  // --- Branch/Semester-
  const semesterKey =
    semester === "First Year" && group ? `First Year-${group}` : semester;

  const selectedCourses =
    branch && semesterKey
      ? courseCatalog[branch]?.[semesterKey] || []
      : [];

  
  const handleDialogOpen = () => {
    setNewCourse({ id: "", name: "", attended: 0, total: 0 });
    setOpenDialog(true);
  };
  const handleDialogClose = () => setOpenDialog(false);

  const handleSaveCourse = () => {
    if (!newCourse.name.trim()) return;
    const id = newCourse.id || `c${Date.now()}`;
    setCourses((prev) => [...prev, { ...newCourse, id }]);
    handleDialogClose();
  };

  const totalCourses = courses.length;

 
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          {/* Title */}
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
            <img
              src="/src/assets/logo.png"
              alt="ScriptFruit Logo"
              width={55}
              height={55}
              style={{ marginRight: 8 }}
            />
            <Typography variant="h6" fontFamily={"sans-serif"} component="div" fontSize={14}>
              ScriptFruit
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button color="inherit" startIcon={<Add />} onClick={handleDialogOpen} size="small">
              Add Course
            </Button>
            <Button color="inherit" startIcon={<RestartAlt />} onClick={resetAll}>
              Reset
            </Button>
            <IconButton
              color="inherit"
              onClick={toggleMode}
              aria-label="Toggle light/dark mode"
            >
              {mode === "light" ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        {/* Branch/SemesterSelectors */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4} {...({} as any)}>
            <FormControl fullWidth sx={{ minWidth: 200 }}>
              <InputLabel>Branch</InputLabel>
              <Select value={branch} onChange={(e) => setBranch(e.target.value)}>
                <MenuItem value="ME">ME</MenuItem>
                <MenuItem value="CHE">CHE</MenuItem>
                <MenuItem value="CSE">CSE</MenuItem>
                <MenuItem value="ELE">ELE</MenuItem>
                <MenuItem value="MME">MME</MenuItem>
                <MenuItem value="CE">CE</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="ECE">ECE</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4} {...({} as any)}>
            <FormControl fullWidth sx={{ minWidth: 200 }}>
              <InputLabel>Semester</InputLabel>
              <Select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                <MenuItem value="First Year">First Year</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="6">6</MenuItem>
                <MenuItem value="7">7</MenuItem>
                <MenuItem value="8">8</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {semester === "First Year" && (
            <Grid item xs={12} sm={6} md={4} {...({} as any)}>
              <FormControl fullWidth>
                <InputLabel>Group</InputLabel>
                <Select value={group} onChange={(e) => setGroup(e.target.value)}>
                  <MenuItem value="Group A">Group A</MenuItem>
                  <MenuItem value="Group B">Group B</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>

        {/* Selected Courses*/}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {selectedCourses.map((c) => (
            <Grid item key={c.id} xs={12} sm={6} md={4} {...({} as any)}>
              <AttendanceCard
                name={c.name}
                attended={c.attended}
                total={c.total}
                onPresent={() => markPresent(c.id)}
                onAbsent={() => markAbsent(c.id)}
                onDelete={() => deleteCourse(c.id)}
              />
            </Grid>
          ))}

          {selectedCourses.length === 0 && (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Please select Branch and Semester to see courses.
            </Typography>
          )}
        </Grid>

        {/* Search + Filter */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <TextField
            label="Filter"
            select
            variant="outlined"
            size="small"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="safe">On Track</MenuItem>
            <MenuItem value="warning">Borderline</MenuItem>
            <MenuItem value="critical">At Risk</MenuItem>
          </TextField>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Total Courses: {totalCourses} | Showing: {filteredCourses.length}
        </Typography>

        {/* All Courses (Filter applied) */}
        <Grid container spacing={2}>
          {filteredCourses.map((c) => (
            <Grid item key={c.id} xs={12} sm={6} md={4} {...({} as any)}>
              <AttendanceCard
                name={c.name}
                attended={c.attended}
                total={c.total}
                onPresent={() => markPresent(c.id)}
                onAbsent={() => markAbsent(c.id)}
                onDelete={() => deleteCourse(c.id)}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Add/Edit Course*/}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Add Course</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Course Name"
              value={newCourse.name}
              onChange={(e) =>
                setNewCourse({ ...newCourse, name: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Attended"
              type="number"
              value={newCourse.attended}
              onChange={(e) =>
                setNewCourse({ ...newCourse, attended: Number(e.target.value) })
              }
            />
            <TextField
              label="Total Classes"
              type="number"
              value={newCourse.total}
              onChange={(e) =>
                setNewCourse({ ...newCourse, total: Number(e.target.value) })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveCourse}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}




