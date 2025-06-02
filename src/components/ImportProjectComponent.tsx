import { Box, Button, Stack, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import useTasksStore, { Project, Task } from "../stores/useTasksStore";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { bst } from "../tools/betriebsstellen";

import Papa from "papaparse";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";
import "dayjs/locale/de";
import generateUniqueId from "generate-unique-id";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("de");
dayjs().locale("de").format();

interface ImportType {
  Id: string;
  Status: string;
  Maßnahmenkategorie: string;
  Titel: string;
  "VzG Streckennr.": string;
  "BSt von / BSt bis": string;
  Zeitraum: string;
}

interface AddProjectProps {
  task: Task;
  cancleFunction: () => void;
  setTaskFunction: (task: Task) => void;
}

const columns: GridColDef[] = [
  { field: "regID", headerName: "Anmeldung-ID", width: 130 },
  { field: "status", headerName: "Status", width: 200 },
  { field: "title", headerName: "Titel", width: 400 },
  { field: "startBst", headerName: "Bst von", width: 100 },
  { field: "endBst", headerName: "Bst nach", width: 100 },
  { field: "startVzg", headerName: "VzG von", width: 100 },
  { field: "endVzg", headerName: "VzG nach", width: 100 },
  { field: "startDate", headerName: "Datum von", width: 200 },
  { field: "endDate", headerName: "Datum bis", width: 200 },
];

export default function ImportProjectComponent(props: AddProjectProps) {
  const { addProject, getTask } = useTasksStore();

  const [data, setData] = useState<ImportType[]>([]);
  // const [projects, setProjects] = useState<Project[]>([]);
  const [rows, setRows] = useState<GridRowsProp>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const parseZeitraum = (zeitraum: string): { start: string; end: string } => {
    const re1 = /^(\d{2}\.\d{2}\.\d{4}) (\d{2}:\d{2}) - (\d{2}:\d{2})$/;
    const re2 =
      /^(\d{2}\.\d{2}\.\d{4}) (\d{2}:\d{2}) - (\d{2}\.\d{2}\.\d{4}) (\d{2}:\d{2})$/;

    let start: dayjs.Dayjs, end: dayjs.Dayjs;

    if (re2.test(zeitraum)) {
      const [, startDate, startTime, endDate, endTime] = zeitraum.match(re2)!;
      start = dayjs(`${startDate} ${startTime}`, "DD.MM.YYYY HH:mm");
      end = dayjs(`${endDate} ${endTime}`, "DD.MM.YYYY HH:mm");
    } else if (re1.test(zeitraum)) {
      const [, date, startTime, endTime] = zeitraum.match(re1)!;
      start = dayjs(`${date} ${startTime}`, "DD.MM.YYYY HH:mm");
      end = dayjs(`${date} ${endTime}`, "DD.MM.YYYY HH:mm");
    } else {
      start = end = dayjs(NaN);
    }

    return {
      start: start.isValid() ? start.format("YYYY-MM-DDTHH:mm:ss[Z]") : "",
      end: end.isValid() ? end.format("YYYY-MM-DDTHH:mm:ss[Z]") : "",
    };
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles?.[0];
    if (file) {
      Papa.parse(file, {
        header: true, // CSV mit Headerzeile
        skipEmptyLines: true,
        complete: (result) => {
          setData(result.data as ImportType[]); // Array von Objekten
        },
        error: (error) => {
          console.error("CSV Parse Error:", error);
        },
      });
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSave = () => {
    if (!rows) return;

    const selectedRows = rows.filter((row) => selectedIds.includes(row.id));

    if (selectedRows.length === 0) return;
    selectedRows.forEach((row) => {
      addProject(props.task.id, row as Project);
    });

    const updatedTask = getTask(props.task.id);
    if (updatedTask) {
      props.setTaskFunction(updatedTask);
    }
    props.cancleFunction();
  };

  useEffect(() => {
    const projects: Project[] = data.map((values) => {
      const splitBst = values["BSt von / BSt bis"].split(" - ");
      const startBst = bst.find(
        (betriebstelle) => betriebstelle.RL100Kurz === splitBst[0]
      );
      const endBst = bst.find(
        (betriebstelle) => betriebstelle.RL100Kurz === splitBst[1]
      );

      const { start, end } = parseZeitraum(values.Zeitraum);

      return {
        id: generateUniqueId({ length: 8 }),
        regID: values.Id.split("-")[1],
        bbmnID: "",
        status: values["Status"],
        category: values["Maßnahmenkategorie"],
        title: values["Titel"],
        startVzg: values["VzG Streckennr."].split(" - ")[0],
        endVzg: values["VzG Streckennr."].split(" - ")[1],
        startBst: startBst ? startBst.RL100Code : "",
        endBst: endBst ? endBst.RL100Code : "",
        startDate: start,
        endDate: end,
        completed: false,
        appointments: [],
        comments: [],
        createdAt: dayjs().utc().toLocaleString(),
      };
    });
    setRows(projects);
  }, [data]);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
        <div
          {...getRootProps()}
          style={{
            border: "2px dashed gray",
            borderRadius: 5,
            padding: 20,
            marginBottom: 30,
          }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography>Datei loslassen...</Typography>
          ) : (
            <Typography>Datei hierhin ziehen oder klicken</Typography>
          )}
        </div>

        <Stack direction="column" spacing={1}>
          <Box height={300} width="100%">
            <DataGrid
              columns={columns}
              rows={rows}
              checkboxSelection
              onRowSelectionModelChange={(selection) => {
                setSelectedIds(Array.from(selection.ids) as string[]);
              }}
            />
          </Box>
          {/* <TableContainer sx={{ maxHeight: 300 }}>
            <Table sx={{ minWidth: 500 }}>
              <TableHead
                sx={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <TableRow>
                  <TableCell sx={{ minWidth: 130 }}>Anmeldung-ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Kategorie</TableCell>
                  <TableCell sx={{ minWidth: 300 }}>Titel</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>Bst von</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>Bst bis</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>VzG von</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>VzG bis</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>Datum von</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>Datum bis</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.regID}</TableCell>
                    <TableCell>{project.status}</TableCell>
                    <TableCell>{project.category}</TableCell>
                    <TableCell>{project.title}</TableCell>
                    <TableCell>{project.startBst}</TableCell>
                    <TableCell>{project.endBst}</TableCell>
                    <TableCell>{project.startVzg}</TableCell>
                    <TableCell>{project.endVzg}</TableCell>
                    <TableCell>
                      {dayjs(project.startDate)
                        .utc()
                        .format("DD.MM.YYYY HH:mm")}
                    </TableCell>
                    <TableCell>
                      {dayjs(project.endDate).utc().format("DD.MM.YYYY HH:mm")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer> */}

          {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}

          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSave()}
          >
            Importieren
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
