// Project Proposal: Support Ticket Console Application
// Project Title: Support Ticket Management System

// Objective: To build a simple support ticket system that allows users to 

// 1. Record customer problems
// 2. Track which problems are still open
// 3. See which issues are urgent
// 4. Mark issues as solved
// 5. Find specific tickets quickly

// User Stories:
// 1. As a user, I want to be able to record customer problems so I can keep track of them.
// 2. As a user, I want to be able to track which problems are still open.
// 3. As a user, I want to be able to track which issues are urgent and needs priority.
// 4. As a user, I want to be able to mark issues solved for clean work.
// 5. As a user, I want to be able to search specific tickets as quickly as possible.

// Loading the readline module
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let tickets = [];
let nextId = 1;

// My Main Menu
function showMenu() {
  console.log("\n~~~~~~~~~~~~ SUPPORT TICKET SYSTEM ~~~~~~~~~~~~");
  console.log("1. Create Ticket");
  console.log("2. Show Tickets");
  console.log("3. Search Ticket");
  console.log("4. Update Ticket Status");
  console.log("5. Delete Ticket");
  console.log("6. Exit");

  rl.question("\nChoose a number: ", (choice) => { 
    switch(choice) { 
      case "1": createTicket();
      break;            
      case "2": viewTickets();
      break;
      case "3": searchTicket();
      break;
      case "4": updateTicket();
      break;            
      case "5": deleteTicket();
      break;           
      case "6": console.log("Exit");
      rl.close();
      break;            
      default: console.log("Invalid choice.");
      showMenu();
    } 
  });
}

// Creating and recording customer problems
function createTicket() {
  rl.question("Enter your ticket title: ", (title) => {
    rl.question("Enter your ticket description: ", (description) => {
      rl.question("Enter your priority level (Low / Medium / High): ", (priority) => {
        if (priority === "Low" || priority === "Medium" || priority === "High") {
          let ticket = { 
            id: nextId,
            title: title,
            description: description,
            status: "Open",
            priority: priority,
            createdAt: new Date()
          }
          tickets.push(ticket);
          nextId++;
          console.log("\nTicket has been created successfully!");
          showMenu();
        }
        else {
          console.log("Invalid priority. Choose from Low/Medium/High.");
          createTicket();
          }
      });
    });
  });
}

// Viewing created tickets
function viewTickets() {
  if (tickets.length === 0) {
    console.log("No tickets found.");
  } else {
    console.log("\n~~~~~~~~~~~~~~~~~ TICKET LIST ~~~~~~~~~~~~~~~~~");
    for (let i = 0; i < tickets.length; i++) {
      console.log("ID:", tickets[i].id);
      console.log("Title:", tickets[i].title);
      console.log("Description:", tickets[i].description);
      console.log("Status:", tickets[i].status);
      console.log("Priority:", tickets[i].priority);
      console.log("Date Created:", tickets[i].createdAt);
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    }
  }
  showMenu();
}

// Searching for specific tickets based on a category
function searchTicket() {
  console.log("\nSearch By:");
  console.log("1. Ticket ID");
  console.log("2. Open Tickets");
  console.log("3. Closed Tickets");
  console.log("4. Low Priority");
  console.log("5. Medium Priority");
  console.log("6. High Priority");
  rl.question("Choose search option: ", (choice) => {
    switch(choice) {
      case "1": searchById();
      break;
      case "2": searchByStatus("Open");
      break;
      case "3": searchByStatus("Closed");
      break;
      case "4": searchByPriority("Low");
      break;
      case "5": searchByPriority("Medium");
      break;
      case "6": searchByPriority("High");
      break;
      default: console.log("Invalid option.");
      showMenu();
    }
  });
}

// Searching for tickets by ID
function searchById() {
  rl.question("Enter Ticket ID: ", (id) => {
    let found = false;
    for (let i = 0; i < tickets.length; i++) {
      if (tickets[i].id == id) {
        console.log("\nTicket Found:");
        console.log(tickets[i]);
        found = true;
        break;
      }
    }
    if (!found) {
      console.log("\nTicket not found.");
    }
    showMenu();
  });
}

// Searching for tickets by status
function searchByStatus(status) {
  let found = false;
  for (let i = 0; i < tickets.length; i++) {
    if (tickets[i].status === status) {
      console.log("\nTicket Found:");
      console.log(tickets[i]);
      found = true;
    }
  }
  if (!found) {
    console.log("\nNo tickets found.");
  }
  showMenu();
}

// Searching for tickets by priority level
function searchByPriority(priority) {
  let found = false;
  for (let i = 0; i < tickets.length; i++) {
    if (tickets[i].priority === priority) {
      console.log("\nTicket Found:");
      console.log(tickets[i]);
      found = true;
    }
  }
  if (!found) {
    console.log("\nNo tickets found.");
  }
  showMenu();
}

// Updating ticket status
function updateTicket() {
  rl.question("Enter ticket ID to update: ", (id) => {
    let found = false;
    for (let i = 0; i < tickets.length; i++) {
      if (tickets[i].id == id) {
        rl.question("Enter new status (Open / Closed): ", (status) => {
          if (status === "Open" || status === "Closed") {
            tickets[i].status = status;
            console.log("Ticket has been updated!");
            showMenu();
          } else {
            console.log("Invalid status. Please enter Open or Closed.");
            updateTicket();
          }
        });
        found = true;
        break;
      }
    }
    if (!found) {
      console.log("Ticket not found.");
      showMenu();
    }
  });
}

// Deleting unneeded/closed tickets
function deleteTicket() {
  rl.question("Enter ticket ID to delete: ", (id) => {
    let found = false;
    for (let i = 0; i < tickets.length; i++) {
      if (tickets[i].id == id) {
        tickets.splice(i, 1);
        console.log("\nTicket has been deleted.");
        found = true;
        break;
      }
    }
    if (!found) {
      console.log("\nTicket not found.");
    }
    showMenu();
  });
}
showMenu();