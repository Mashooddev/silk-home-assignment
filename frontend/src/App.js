import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Table,
  Thead,
  Tbody,
  Badge,
  Tr,
  Th,
  Td,
  MenuList,
  MenuButton,
  TableContainer,
  Menu,
  MenuItem,
  Text,
  Button,
  IconButton,
  Card,
  CardBody,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Select,
} from "@chakra-ui/react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import moment from "moment/moment";
import swal from "sweetalert";
import CheckIcon from "@mui/icons-material/Check";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
function App() {
  const [tickets, setTickets] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [priority, setPriority] = useState("");
  const [id, setid] = useState("");
  const [ModalTitle, setModalTitle] = useState("Create Ticket");
  const onClose = () => setIsOpen(false);

  async function getTickets() {
    const response = await fetch("http://localhost:8080/ticket/list");
    const data = await response.json();
    console.log(data);
    setTickets(data.list);
  }
  useEffect(() => {
    getTickets();
  }, []);

  async function createTicket() {
    const response = await fetch("http://localhost:8080/ticket/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: description,
        source: source,
        status: "Open",
        priority: priority,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (data.result === true) {
      swal("Success!", data.message, "success");
      getTickets();
      onClose();
    } else {
      swal("Oops!", "Something Went Wrong!", "error");
    }
  }

  async function editTicket() {
    const response = await fetch(`http://localhost:8080/ticket/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: description,
        source: source,
        priority: priority,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (data.result === true) {
      swal("Success!", data.message, "success");
      getTickets();
      onClose();
    } else {
      swal("Oops!", "Something Went Wrong!", "error");
    }
  }

  return (
    <div className="App">
      <Card>
        <CardBody>
          <Stack d={"flex"} flexDir={"row"} justifyContent={"space-between"}>
            <Text fontSize="26px">Ticket List</Text>
            <Button
              onClick={() => {
                setIsOpen(true);
                setModalTitle("Create Ticket");
                setTitle("");
                setDescription("");
                setSource("");
                setPriority("");
              }}
            >
              Create Ticket
            </Button>
          </Stack>
          <Card mt={4}>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Name</Th>
                    <Th>Priority</Th>
                    <Th>Source</Th>
                    <Th>Description</Th>
                    <Th>Status</Th>
                    <Th>Created At</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tickets?.length > 0 ? (
                    tickets.map((d, i) => (
                      <Tr>
                        <Td>{i + 1}</Td>
                        <Td>{d.title}</Td>
                        <Td>
                          <Badge
                            colorScheme={
                              d.priority === "High"
                                ? "red"
                                : d.priority === "Medium"
                                ? "yellow"
                                : "green"
                            }
                          >
                            {d.priority}
                          </Badge>
                        </Td>
                        <Td>{d.source}</Td>
                        <Td>
                          <span className="desc-container">
                            {d.description}
                          </span>
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={
                              d.status === "Complete"
                                ? "green"
                                : d.status === "Open"
                                ? "red"
                                : "yellow"
                            }
                          >
                            {d.status}
                          </Badge>
                        </Td>
                        <Td>{moment(d.createdAt).format("DD-MM-YYYY")}</Td>
                        <Td>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              aria-label="Options"
                              icon={<MoreVertIcon />}
                              variant="outline"
                            />
                            <MenuList>
                              <MenuItem
                                onClick={() => {
                                  setModalTitle("Edit Ticket");
                                  setid(d._id);
                                  setTitle(d.title);
                                  setDescription(d.description);
                                  setSource(d.source);
                                  setPriority(d.priority);
                                  setIsOpen(true);
                                }}
                                icon={<CreateIcon />}
                              >
                                Edit
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  swal({
                                    text: "Are you sure you want to delete the ticket ?",
                                    buttons: true,
                                    dangerMode: false,
                                  }).then(async (willDelete) => {
                                    if (willDelete) {
                                      const response = await fetch(
                                        `http://localhost:8080/ticket/delete/${d._id}`,
                                        {
                                          method: "DELETE",
                                          headers: {
                                            "Content-Type": "application/json",
                                          },
                                          // body: JSON.stringify(),
                                        }
                                      );
                                      const data = await response.json();
                                      console.log(data);

                                      if (data.result === true) {
                                        swal(
                                          "Deleted!",
                                          data.message,
                                          "success"
                                        );
                                        getTickets();
                                      } else {
                                        swal(
                                          "Error!",
                                          "Something Went Wrong!",
                                          "error"
                                        );
                                      }
                                    }
                                  });
                                }}
                                icon={<DeleteIcon />}
                              >
                                Delete
                              </MenuItem>
                              {d.status === "Complete" ? (
                                <MenuItem
                                  onClick={() => {
                                    swal({
                                      text: "Are you sure you want to Open the ticket ?",
                                      buttons: true,
                                      dangerMode: false,
                                    }).then(async (willDelete) => {
                                      if (willDelete) {
                                        const response = await fetch(
                                          `http://localhost:8080/ticket/open/${d._id}`,
                                          {
                                            method: "PUT",
                                            headers: {
                                              "Content-Type":
                                                "application/json",
                                            },
                                            // body: JSON.stringify(),
                                          }
                                        );
                                        const data = await response.json();
                                        console.log(data);

                                        if (data.result === true) {
                                          swal(
                                            "Success!",
                                            data.message,
                                            "success"
                                          );
                                          getTickets();
                                        } else {
                                          swal(
                                            "Oops!",
                                            "Something Went Wrong!",
                                            "error"
                                          );
                                        }
                                      }
                                    });
                                  }}
                                  icon={<EventRepeatIcon />}
                                >
                                  Mark as Open
                                </MenuItem>
                              ) : (
                                <MenuItem
                                  onClick={() => {
                                    swal({
                                      text: "Are you sure you want to Complete the ticket ?",
                                      buttons: true,
                                      dangerMode: false,
                                    }).then(async (willDelete) => {
                                      if (willDelete) {
                                        const response = await fetch(
                                          `http://localhost:8080/ticket/complete/${d._id}`,
                                          {
                                            method: "PUT",
                                            headers: {
                                              "Content-Type":
                                                "application/json",
                                            },
                                            // body: JSON.stringify(),
                                          }
                                        );
                                        const data = await response.json();
                                        console.log(data);

                                        if (data.result === true) {
                                          swal(
                                            "Success!",
                                            data.message,
                                            "success"
                                          );
                                          getTickets();
                                        } else {
                                          swal(
                                            "Oops!",
                                            "Something Went Wrong!",
                                            "error"
                                          );
                                        }
                                      }
                                    });
                                  }}
                                  icon={<CheckIcon />}
                                >
                                  Mark as Completed
                                </MenuItem>
                              )}
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td></Td>
                      <Td></Td>
                      <Td></Td>
                      <Td>No Data Found</Td>
                      <Td></Td>
                      <Td></Td>
                      <Td></Td>
                      <Td></Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </Card>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{ModalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Source</FormLabel>
              <Select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Select option"
              >
                <option value="Github">Github</option>
                <option value="Gitlab">Gitlab</option>
                <option value="Gitbucket">Gitbucket</option>
                <option value="AWS">AWS</option>
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Priority</FormLabel>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                placeholder="Select option"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={
                ModalTitle === "Create Ticket" ? createTicket : editTicket
              }
              colorScheme="blue"
              mr={3}
            >
              {ModalTitle === "Create Ticket" ? "Create" : "Save"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default App;
