import { de, faker } from "@faker-js/faker";
import axios from "axios";
import { User, UserRole } from "../types/user";
import { Flight } from "../types/flight";
import { Ticket } from "../types/ticket";
import { History } from "../types/history";

// // Hàm tạo user giả
const createUser = (): User => {
  return {
    ID: faker.number.int({ min: 1, max: 10000 }), // Sử dụng faker.number.int cho số ngẫu nhiên trong khoảng
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    phone_number: faker.phone.number(), // Sử dụng đúng phương thức cho số điện thoại
    identity_id: faker.number
      .int({ min: 100000000000, max: 999999999999 })
      .toString(), // Sử dụng faker cho cccd
    passport: faker.number
      .int({ min: 100000000000, max: 999999999999 })
      .toString(), // Sử dụng faker cho passport
    role: Math.random() < 0.5 ? UserRole.Manager : UserRole.Customer,
    status: true,
    CreatedAt: faker.date.recent().toISOString(),
    UpdatedAt: faker.date.recent().toISOString(),
  };
};

// // Hàm trì hoãn 1 giây
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Hàm tạo user với trì hoãn 1 giây và gửi request
const createUserWithDelay = async (): Promise<User> => {
  await delay(1000); // Trì hoãn 1 giây
  const user = createUser();

  // Sử dụng Axios để gửi request tới API
  try {
    const response = await axios.post(
      "https://handtairlines.onrender.com/api/auth/register",
      user
    );
    console.log("User created:", response.data); // In ra dữ liệu của user đã được tạo từ API
  } catch (error) {
    console.error("Error creating user:", error);
  }

  return user;
};

// Hàm tạo nhiều user giả
const createUsers = async (n: number): Promise<User[]> => {
  const users = [];
  for (let i = 0; i < n; i++) {
    const user = await createUserWithDelay();
    users.push(user);
  }
  return users;
};

// // Tạo và in user giả với thời gian trì hoãn 1 giây cho mỗi request
// // createUsers(100).then((users) => {
// //   console.log("All users created:", users);
// // });

// // Hàm tạo chuyến bay giả
const createFlight = (): Flight => {
  return {
    ID: faker.number.int({ min: 1, max: 10000 }),
    CreatedAt: faker.date.recent().toISOString(),
    UpdatedAt: faker.date.recent().toISOString(),
    DeletedAt: null,
    flight_number: `H&T${faker.number.int({ min: 1, max: 10000 })}`,
    departure_airport: faker.address.city(),
    arrival_airport: faker.address.city(),
    departure_time: faker.date.future().toISOString(),
    arrival_time: faker.date.future().toISOString(),
    aircraft_type: faker.vehicle.vehicle(),
    ticket: [],
    status: true,
  };
};

// Hàm kiểm tra xem chuyến bay có ID cụ thể đã có trong database hay chưa
const getFlightFromDatabase = async (flightId: number): Promise<Flight | null> => {
  try {
    const response = await axios.get(`https://handtairlines.onrender.com/api/flights/${flightId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting flight from database:", error);
    return null;
  }
};

// Hàm tạo chuyến bay mới với ID chưa có trong database
const createFlightWithId = async (flightId: number): Promise<Flight> => {
  const flight = createFlight();
  flight.ID = flightId;

  try {
    const response = await axios.post(
      "https://handtairlines.onrender.com/api/flights",
      flight,
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzE2NjI4NzIsImlkIjoxLCJyb2xlIjoibWFuYWdlciJ9.un9MldAHfOCsjPDhE6DPb2hTglKhHL3i0v1hCMmfwEY`,
        },
      }
    );
    console.log("Flight created:", response.data); // In ra dữ liệu của chuyến bay đã được tạo từ API
  } catch (error) {
    console.error("Error creating flight:", error);
  }

  return flight;
};

// Hàm tạo nhiều chuyến bay giả với ID chưa có trong database
const createFlights = async (startId: number, n: number): Promise<Flight[]> => {
  const flights = [];
  let flightId = startId;
  for (let i = 0; i < n; i++) {
    while (true) {
      const existingFlight = await getFlightFromDatabase(flightId);
      if (!existingFlight) {
        const flight = await createFlightWithId(flightId);
        flights.push(flight);
        flightId++;
        break;
      }
      flightId++;
    }
  }
  return flights;
};

// // Tạo và in chuyến bay giả với ID chưa có trong database
// const createMoreFlights = async () => {
//   const nextFlightId = 9653 + 347 + 1;
//   const flights = await createFlights(nextFlightId, 331);
//   console.log("All flights created:", flights);
// };

// // createMoreFlights();


// /// TẠO VÉ MẪU
const createTicket = (): Ticket => {
  return {
    ID: faker.number.int({ min: 1, max: 10500 }),
    flight_id: faker.number.int({ min: 1, max: 10000 }),
    flight: null,
    price: faker.number.int({ min: 1, max: 10000 }),
    ticket_type: faker.helpers.arrayElement(["Economy", "Business", "First Class"]),
    description: faker.lorem.sentence(),
    available_seat: faker.number.int({ min: 1, max: 200 }),
    status: true,
    CreatedAt: faker.date.recent().toISOString(),
    UpdatedAt: faker.date.recent().toISOString(),
    DeletedAt: null,
  };
};

// Hàm delay 1 giây
// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/// Tạo danh sách vé
const createTickets = async (startId: number, n: number): Promise<Ticket[]> => {
  const tickets: Ticket[] = [];
  let ticketId = startId;
  for (let i = 0; i < n; i++) {
    while (true) {
      const existingTicket = await getTicketFromDatabase(ticketId);
      if (!existingTicket) {
        const ticket = await createTicketWithId(ticketId);
        if (ticket) { // Kiểm tra nếu vé được tạo thành công
          tickets.push(ticket);
          ticketId++;
          await delay(1000); // thêm delay 1 giây sau mỗi lần tạo vé
          break;
        } else {
          console.error(`Error creating ticket with ID ${ticketId}`);
          ticketId++;
        }
      } else {
        console.log(`Ticket with ID ${ticketId} already exists`);
        ticketId++;
      }
    }
  }
  return tickets;
};

// Hàm tạo vé với ID cụ thể và gửi lên API
const createTicketWithId = async (ticketId: number): Promise<Ticket> => {
  const ticket = createTicket();
  ticket.ID = ticketId;

  try {
    const response = await axios.post(
      "https://handtairlines.onrender.com/api/tickets",
      ticket,
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzE2NjI4NzIsImlkIjoxLCJyb2xlIjoibWFuYWdlciJ9.un9MldAHfOCsjPDhE6DPb2hTglKhHL3i0v1hCMmfwEY`,
        },
      }
    );
    console.log("Ticket created:", response.data); // In ra dữ liệu của vé đã được tạo từ API
  } catch (error) {
    console.error("Error creating ticket:", error);
  }

  return ticket;
};

// Kiểm tra vé từ database dựa trên ticketId
const getTicketFromDatabase = async (ticketId: number): Promise<Ticket | null> => {
  try {
    const response = await axios.get(`https://handtairlines.onrender.com/api/tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting ticket from database:", error);
    return null;
  }
};

// Tạo và in vé giả với ID chưa có trong database
const createMoreTickets = async () => {
  const nextTicketId = 10000 + 1;
  const tickets = await createTickets(nextTicketId, 500);
  console.log("All tickets created:", tickets);
};

// // Gọi hàm createMoreTickets
// // createMoreTickets();

///ODER VÉ MẪU
let historyId = 14414;

const userIds = Array.from({ length: 13000 }, (_, i) => i + 1);
const ticketIds = Array.from({ length: 13000 }, (_, i) => i + 1);
const seatNumbers = ["A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4", "B5", "C1", "C2", "C3", "C4", "C5", "D1", "D2", "D3", "D4", "D5", "E1", "E2", "E3", "E4", "E5"];

const createHistory = async (): Promise<History> => {
  let newId = historyId++;
  while (await checkIdExists(newId)) {
    newId = historyId++;
  }

  const userId = 2;
  const ticketId = 10379;
  const seatNumber = faker.helpers.arrayElement(seatNumbers);

  return {
    ID: newId,
    user_id: userId,
    user: null,
    ticket_id: ticketId,
    ticket: null,
    total_amount: faker.number.int({ min: 1, max: 1000 }),
    seat_number: seatNumber,
    gate: faker.helpers.arrayElement(["A", "B", "C", "D", "E"]),
    CreatedAt: faker.date.recent().toISOString(),
    UpdatedAt: faker.date.recent().toISOString(),
    DeletedAt: null,
    status: true,
  };
};

const checkIdExists = async (id: number): Promise<boolean> => {
  try {
    const response = await axios.get(`https://handtairlines.onrender.com/api/bookings/${id}`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

const createHistoryWithDelay = async (): Promise<History | null> => {
  const history = await createHistory();

  try {
    const response = await axios.post(
      "https://handtairlines.onrender.com/api/bookings",
      history,
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzIwODU1NjEsImlkIjoyLCJyb2xlIjoiY3VzdG9tZXIifQ.eekP-MJRhSov5WMCF8CIU0sj_ktAFTc354D3NmThGmM`,
        },
      }
    );
    console.log("History created:", response.data); // In ra dữ liệu của history đã được tạo từ API


    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)); // Trì hoãn một giây trước khi tạo history tiếp theo
    await delay(1000); // chờ đợi 1 giây trước khi tạo history tiếp theo
    

    return history;

  } catch (error) {
    console.error("Error creating history:", error);
    return null;
  }
};

const createHistoriesWithDelay = async (n: number): Promise<History[]> => {
  const histories: History[] = [];

  for (let i = 0; i < n; i++) {
    const history = await createHistoryWithDelay();
    if (history) {
      histories.push(history);
    }
  }

  return histories;
};

createHistoriesWithDelay(6000).then((histories) => {
  console.log("All histories created:", histories);
});