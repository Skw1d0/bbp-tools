import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { bst } from "../tools/betriebsstellen";
import { categories } from "../tools/categories";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/de";
import useTasksStore, { Project, Task } from "../stores/useTasksStore";
import generateUniqueId from "generate-unique-id";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("de");
dayjs().locale("de").format();

interface AddProjectProps {
  task: Task;
  cancleFunction: () => void;
  setTaskFunction: (task: Task) => void;
  project?: Project;
}

export default function AddProjectComponent(props: AddProjectProps) {
  const { addProject, editProject } = useTasksStore();

  const [regID, setRegID] = useState<string>("");
  // const [bbmnID, setBbmnID] = useState("");
  const [title, setTitle] = useState("");
  const [state, setState] = useState("");
  const [category, setCategory] = useState("");
  const [startVzG, setStartVzG] = useState("");
  const [endVzG, setEndVzG] = useState("");
  const [startBst, setStartBst] = useState("");
  const [endBst, setEndBst] = useState("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const handleChangeCategory = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  const handleSave = () => {
    if (endDate === null || startDate === null) return;

    const newId = generateUniqueId({ length: 8 });
    const projectToSave: Project = {
      id: newId,
      regID: regID,
      // bbmnID: bbmnID,
      category: category,
      endBst: endBst,
      status: state,
      title: title,
      startBst: startBst,
      startDate: startDate.utc().toISOString(),
      endDate: endDate.utc().toISOString(),
      endVzg: endVzG,
      startVzg: startVzG,
      completed: false,
      notifications: [],
      comments: [],
      createdAt: dayjs.utc().toISOString(),
    };

    if (!props.project) {
      props.setTaskFunction(addProject(props.task.id, projectToSave));
    } else {
      props.setTaskFunction(
        editProject(props.task.id, props.project, projectToSave)
      );
    }

    // TODO: RETURN NEW TASKS TO PARENT
    props.cancleFunction();
  };

  useEffect(() => {
    if (!props.project) return;

    setRegID(props.project.regID);
    // setBbmnID(props.project.bbmnID);
    setTitle(props.project.title);
    setState(props.project.status);
    setCategory(props.project.category);
    setStartVzG(props.project.startVzg);
    setEndVzG(props.project.endVzg);
    setStartBst(props.project.startBst);
    setEndBst(props.project.endBst);
    setStartDate(dayjs(props.project.startDate).utc());
    setEndDate(dayjs(props.project.endDate).utc());
  }, [props.project]);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
        <Box padding={2}>
          <Card variant="outlined">
            <CardHeader
              title={props.project ? "Projekt bearbeiten" : "Neues Projekt"}
            />
            <CardContent>
              <Stack direction="column" spacing={1}>
                <TextField
                  // variant="filled"
                  label="Anmedung-ID"
                  type="number"
                  slotProps={{
                    input: {
                      inputProps: { min: 0 },
                    },
                  }}
                  value={regID}
                  onChange={(e) => setRegID(e.target.value)}
                  onFocus={(e) => e.target.select()}
                />
                <TextField
                  // variant="filled"
                  label="Titel"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={(e) => e.target.select()}
                />
                <TextField
                  // variant="filled"
                  label="Status"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  onFocus={(e) => e.target.select()}
                />
                <FormControl fullWidth>
                  <InputLabel id="project-category-select-label">
                    Kategorie
                  </InputLabel>
                  <Select
                    // variant="filled"
                    labelId="project-category-select-label"
                    id="project-category-select"
                    value={category}
                    label="Kategorie"
                    onChange={handleChangeCategory}
                  >
                    {categories.map((category) => (
                      <MenuItem value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Stack direction="row" spacing={1}>
                  <TextField
                    // variant="filled"
                    label="VzG von"
                    type="number"
                    slotProps={{
                      input: {
                        inputProps: { min: 0 },
                      },
                    }}
                    fullWidth
                    value={startVzG ?? ""}
                    onChange={(e) => setStartVzG(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                  <TextField
                    // variant="filled"
                    label="VzG bis"
                    type="number"
                    slotProps={{
                      input: {
                        inputProps: { min: 0 },
                      },
                    }}
                    fullWidth
                    value={endVzG ?? ""}
                    onChange={(e) => setEndVzG(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Autocomplete
                    fullWidth
                    autoHighlight
                    options={bst}
                    value={
                      bst.find((option) => option.RL100Code === startBst) ||
                      null
                    }
                    filterOptions={(options, { inputValue }) =>
                      options
                        .filter((option) =>
                          option.RL100Code.toLowerCase().startsWith(
                            inputValue.toLowerCase()
                          )
                        )
                        .slice(0, 20)
                    }
                    getOptionLabel={(option) => option.RL100Code}
                    onInputChange={(_, value) => setStartBst(value)}
                    onChange={(_, value) =>
                      setStartBst(value ? value.RL100Code : "")
                    }
                    renderOption={(props, option) => {
                      const { key, ...optionProps } = props;
                      return (
                        <Box
                          key={`${key}_${option.DatumAb}`}
                          component="li"
                          {...optionProps}
                        >
                          {key} - {option.RL100Kurz}
                        </Box>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // variant="filled"
                        label="Bst von"
                      />
                    )}
                  ></Autocomplete>
                  <Autocomplete
                    fullWidth
                    autoHighlight
                    options={bst}
                    value={
                      bst.find((option) => option.RL100Code === endBst) || null
                    }
                    filterOptions={(options, { inputValue }) =>
                      options
                        .filter((option) =>
                          option.RL100Code.toLowerCase().startsWith(
                            inputValue.toLowerCase()
                          )
                        )
                        .slice(0, 20)
                    }
                    getOptionLabel={(option) => option.RL100Code}
                    onInputChange={(_, value) => setEndBst(value)}
                    onChange={(_, value) =>
                      setEndBst(value ? value.RL100Code : "")
                    }
                    renderOption={(props, option) => {
                      const { key, ...optionProps } = props;
                      return (
                        <Box
                          key={`${key}_${option.DatumAb}`}
                          component="li"
                          {...optionProps}
                        >
                          {key} - {option.RL100Kurz}
                        </Box>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // variant="filled"
                        label="Bst bis"
                      />
                    )}
                  ></Autocomplete>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <DateTimePicker
                    sx={{ width: "100%" }}
                    label="Beginn"
                    value={startDate}
                    onChange={(e) => setStartDate(e)}
                  />
                  <DateTimePicker
                    sx={{ width: "100%" }}
                    label="Ende"
                    value={endDate}
                    onChange={(e) => setEndDate(e)}
                  />
                </Stack>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSave()}
                >
                  Speichern
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={props.cancleFunction}
                >
                  Abbrechen
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </LocalizationProvider>
    </>
  );
}
