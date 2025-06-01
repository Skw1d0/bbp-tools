import {
  Autocomplete,
  Box,
  Button,
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
import { useState } from "react";
import { bst } from "../tools/betriebsstellen";
import { categories } from "../tools/categories";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/de";
import useTasksStore, { Task } from "../stores/useTasksStore";
import generateUniqueId from "generate-unique-id";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("de");
dayjs().locale("de").format();

interface AddProjectProps {
  task: Task;
  cancleFunction: () => void;
}

export default function AddProjectComponent(props: AddProjectProps) {
  const { addProject } = useTasksStore();

  const [regID, setRegID] = useState<string>("");
  const [bbmnID, setBbmnID] = useState("");
  const [title, setTitle] = useState("");
  const [state, setState] = useState("");
  const [category, setCategory] = useState("");
  const [startVzG, setStartVzG] = useState<string>("");
  const [endVzG, setEndVzG] = useState<string>("");
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
    addProject(props.task.id, {
      id: newId,
      regID: regID,
      bbmnID: bbmnID,
      category: category,
      endBst: endBst,
      status: state,
      title: title,
      startBst: startBst,
      startDate: startDate.utc().toISOString(),
      endDate: endDate.utc().toISOString(),
      endVzg: endVzG,
      startVzg: startVzG,
      appointments: [],
      completed: false,
      createdAt: dayjs.utc().toISOString(),
    });

    // TODO: RETURN NEW TASKS TO PARENT
    props.cancleFunction();
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
        <Stack direction="column" spacing={1}>
          <TextField
            variant="filled"
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
            variant="filled"
            label="BBMN-ID"
            value={bbmnID}
            onChange={(e) => setBbmnID(e.target.value.toUpperCase())}
            onFocus={(e) => e.target.select()}
          />
          <TextField
            variant="filled"
            label="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={(e) => e.target.select()}
          />
          <TextField
            variant="filled"
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
              variant="filled"
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
              variant="filled"
              label="VzG von"
              type="number"
              slotProps={{
                input: {
                  inputProps: { min: 0 },
                },
              }}
              fullWidth
              value={startVzG}
              onChange={(e) => setStartVzG(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
            <TextField
              variant="filled"
              label="VzG bis"
              type="number"
              slotProps={{
                input: {
                  inputProps: { min: 0 },
                },
              }}
              fullWidth
              value={endVzG}
              onChange={(e) => setEndVzG(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Autocomplete
              fullWidth
              autoHighlight
              options={bst}
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
              onChange={(_, value) => setStartBst(value ? value.RL100Code : "")}
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
                <TextField {...params} variant="filled" label="Bst von" />
              )}
            ></Autocomplete>
            <Autocomplete
              fullWidth
              autoHighlight
              options={bst}
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
              onChange={(_, value) => setEndBst(value ? value.RL100Code : "")}
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
                <TextField {...params} variant="filled" label="Bst bis" />
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
      </LocalizationProvider>
    </>
  );
}
