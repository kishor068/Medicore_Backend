import express, { json } from "express";
import mysql from "mysql2";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Heoo");
  // const id=req.params.id;
  // console.log(id)
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "project",
});
db.connect((err) => {
  if (err) console.log(err);
  else console.log("Connection Successfull!!!");
});
//Registration code,when the registratrion is succesful the page is directed to /user/:id
app.post("/register", (req, res) => {
  let newUserId = null;
  const { uname, password, email } = req.body;
  console.log("Received data:", req.body);
  const values = [uname, password, email];
  db.query("call RegisterUser(?, ?, ?, @newUserId)", values, (err) => {
    if (err) {
      res.status(500).send("Error");
      return;
    }

    db.query("SELECT @newUserId AS newUserId", (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error");
        return;
      }
      // Extract the registeredUserId from the results
      newUserId = results[0].newUserId;

      // Do something with the registeredUserId
      // console.log('Registered User ID:', newUserId);
      console.log("Registered User ID:", newUserId);

      res.json({ Output: newUserId });
    });
  });
});
// app.get('/register',(req,res)=>{
//     const q=
// })
app.get("/user/:id", (req, res) => {
  var id = req.params.id;
  let q = "select uname from user where uid=?";
  db.query(q, [id], (err, data) => {
    if (err) {
      res.status(500).send("Error");
      return;
    }
    return res.json(data);
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  let q = "select uid, isDoctor from user where email=? and password=?";

  db.query(q, [email, password], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error");
      return;
    }

    if (results.length > 0) {
      const user = results[0];
      if (user.isDoctor) {
        // res.redirect(`/user/doctor/${user.uid}`);
        res.json({ code: 1, uid: user.uid });
        // db.query(
        //   "update user set Logintatus=1 where uid=?",
        //   user.uid,
        //   (err) => {
        //     if (err) {
        //       console.log(err);
        //     }
        //   }
        // );
      } else {
        res.json({ code: 0, uid: user.uid });
        // db.query('update user set Logintatus=1 where uid=?',user.uid,(err)=>{
        //     if(err){
        //     console.log(err)}
        // })
      }
    } else {
      res.status(401).send("Invalid credentials");
    }
  });
});

app.get("/form", (req, res) => {
  // let q='select uname,DrId from Doctor D,Dept Dp,user U where D.Did=Dp.Did and  U.uid=D.DrId and Dname=?'
  let q =
    " select DrId,uname,Dname from user U ,Doctor D,Dept Dp where U.uid=D.DrId and Dp.Did=D.Did order by Dname ";
  db.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
  //here i need to get the deparmnet name which was selected in the dropdown and the object of uname should be returned which will be seen in the dropdown
});

app.get('/form/dept',(req,res)=>{
  let q="SELECT Dname FROM Dept";
  db.query(q,(err,data)=>{
    if(err){return res.json(err)
    }return res.json(data)
  })
})

app.post('/getDoc',(req,res)=>{
  let q='select uname from user U,Doctor D,Dept Dp where U.uid=D.DrId and Dp.Did=D.Did and Dname=?'
  let  {Dname}=req.body;
  console.log({Dname});
  db.query(q,[Dname],(err,data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})
// ... (other code remains unchanged)

// app.post("/form/:id", (req, res) => {
//     var id = req.params.id;
//     const { Fname, Lname, age, address, descr, contact, gender, DrID, AppDate } =
//       req.body;
//     let q1 = `INSERT INTO Patient SET Pid = ?, Fname = ?, Lname = ?, age = ?, address = ?, descr = ?, contact = ?, gender = ?`;
//     let q2 = "SELECT uid FROM user U WHERE uname=?";
//     let ur = {}; // Change from const to let

//     // First query
//     db.query(
//       q1,
//       [id, Fname, Lname, age, address, descr, contact, gender],
//       (err) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ message: "Internal Server Error" });
//         }

//         // Second query
//         db.query(q2, [DrID], (err, result) => {
//           if (err) {
//             console.error(err);
//             return res.status(500).json({ message: "Internal Server Error" });
//           }
//           console.log(result[0].uid);
//           ur = result[0].uid;

//           // Now using let instead of const
//           db.query(
//             `INSERT INTO appointment SET DrId=?, Pid=?, Status=?,  AppDate=?`,
//             [ur, id, 0, AppDate],
//             (err) => {
//               if (err) {
//                 console.error(err);
//                 return res.status(500).json({ message: "Internal Server Error" });
//               }
//               return res.json({ success: true });
//             }
//           );
//         });
//       }
//     );
//   });

// ... (other code remains unchanged)

//   app.post("/form/:id", (req, res) => {
//     var id = req.params.id;
//     const { Fname, Lname, age, address, descr, contact, gender, DrID, AppDate } = req.body;
//     let q1 = `INSERT INTO Patient SET Pid = ?, Fname = ?, Lname = ?, age = ?, address = ?, descr = ?, contact = ?, gender = ?`;
//     let q2 = "SELECT uid FROM user U WHERE uname=?";

//     // First query
//     db.query(q1, [id, Fname, Lname, age, address, descr, contact, gender], (err) => {
//       if (err) {
//         console.error("Error in the first query:", err);
//         return res.status(500).json({ message: "Internal Server Error" });
//       }

//       // Second query
//       db.query(q2, [DrID], (err, result) => {
//         if (err) {
//           console.error("Error in the second query:", err);
//           return res.status(500).json({ message: "Internal Server Error" });
//         }

//         if (result.length > 0 && result[0].uid) {
//           const ur = result[0].uid;

//           // Now using let instead of const
//           db.query(
//             `INSERT INTO appointment SET DrId=?, Pid=?, Status=?, AppDate=?`,
//             [ur, id, 0, AppDate],
//             (err) => {
//               if (err) {
//                 console.error("Error inserting into appointment table:", err);
//                 return res.status(500).json({ message: "Internal Server Error" });
//               }
//               return res.json({ success: true });
//               db.query(`insert into Approval set Pid=?,DrId=?,status=?`,[id,ur,0],(err)=>{
//                 if (err) return res.json(err)
//                 return res.json({successfull});
//               })
//             }
//           );
//         } else {
//           return res.status(404).json({ message: "User not found" });
//         }
//       });
//     });
//   });
app.post("/form/:id", (req, res) => {
  var id = req.params.id;
  const { Fname, Lname, age, address, descr, contact, gender, DrID, AppDate } =
    req.body;
  let q1 = `INSERT INTO Patient SET Pid = ?, Fname = ?, Lname = ?, age = ?, address = ?, descr = ?, contact = ?, gender = ?`;
  let q2 = "SELECT uid FROM user U WHERE uname=?";

  // First query
  db.query(
    q1,
    [id, Fname, Lname, age, address, descr, contact, gender],
    (err) => {
      if (err) {
        console.error("Error in the first query:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      // Second query
      db.query(q2, [DrID], (err, result) => {
        if (err) {
          console.error("Error in the second query:", err);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (result.length > 0 && result[0].uid) {
          const ur = result[0].uid;

          // Now using let instead of const
          db.query(
            `INSERT INTO appointment SET DrId=?, Pid=?, Status=?, AppDate=?`,
            [ur, id, 0, AppDate],
            (err) => {
              if (err) {
                console.error("Error inserting into appointment table:", err);
                return res
                  .status(500)
                  .json({ message: "Internal Server Error" });
              }

              // Insert into Approval table
              db.query(
                `INSERT INTO Approval SET Pid=?, DrId=?, status=? `,
                [id, ur, 0],
                (err) => {
                  if (err) {
                    console.error("Error inserting into Approval table:", err);
                    return res
                      .status(500)
                      .json({ message: "Internal Server Error" });
                  }

                  return res.json({ success: true });
                }
              );
            }
          );
        } else {
          return res.status(404).json({ message: "User not found" });
        }
      });
    }
  );
});

app.get("/doctor/pending/:id", (req, res) => {
  let id = req.params.id;

  // const q =
  //   "SELECT P.Pid,P.Fname,P.Lname,P.age,P.address,P.descr,P.contact,P.gender, DATE_FORMAT(A.AppDate, '%Y-%m-%d') AS AppDate FROM Patient P,approval AP,Doctor D,appointment A where P.Pid = AP.Pid and AP.DrId = D.DrId and AP.DrId = D.DrId and D.DrId = ? AND AP.status = ?";
  let q =
    "SELECT P.Pid, P.Fname, P.Lname, P.age, P.address, P.descr, P.contact, P.gender, DATE_FORMAT(A.AppDate, '%Y-%m-%d') AS AppDate FROM Patient P " +
    "JOIN approval AP ON P.Pid = AP.Pid " +
    "JOIN Doctor D ON AP.DrId = D.DrId " +
    "JOIN appointment A ON AP.DrId = A.DrId AND AP.Pid = A.Pid " +
    "WHERE D.DrId = ? AND AP.status = ?";

  const val = [id, 0];
  db.query(q, val, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.post("/doctor/pending/accept/:id", (req, res) => {
  const userId = req.params.id;
  const { i } = req.body;
  // const x=null;
  // console.log(i)
  // Selecting Pid from the Patient table
  let q1 =
    "SELECT Pid FROM Patient WHERE Pid IN (SELECT Pid FROM Approval WHERE DrId = ? AND status = ? )";
  db.query(q1, [userId, 0], (err, result) => {
    if (err) {
      return res.json(err);
    }
    console.log(result);
    // Extracting the Pid values from the result
    let patIds = result[i].Pid;
    console.log("PID Accept" + patIds + " " + userId);
    // Update Approval status for the specified Pid and DrId
    let q2 = "UPDATE Approval SET status = 1 WHERE Pid=? AND DrId = ?";
    db.query(q2, [patIds, userId], (err, result) => {
      if (err) {
        return res.json(err);
      }
      console.log(result);
      // Sending success response
      return res.json("Successful");
    });
  });
});

app.post("/doctor/reject/:id", (req, res) => {
  const userId = req.params.id;
  const { i } = req.body;
  // const x=null;
  // console.log(i)
  // Selecting Pid from the Patient table
  let q1 =
    "SELECT Pid FROM Patient WHERE Pid IN (SELECT Pid FROM Approval WHERE DrId = ? AND status = ? )";
  db.query(q1, [userId, 0], (err, result) => {
    if (err) {
      return res.json(err);
    }
    console.log(result);
    // Extracting the Pid values from the result
    let patIds = result[i].Pid;
    console.log("Reject" + patIds);
    // Update Approval status for the specified Pid and DrId
    let q2 = "UPDATE Approval SET status = 2 WHERE Pid=? AND DrId = ?";
    db.query(q2, [patIds, userId], (err) => {
      if (err) {
        return res.json(err);
      }

      // Sending success response
      return res.json("Successful");
    });
  });
});

app.get("/doctor/approved/:id", (req, res) => {
  let id = req.params.id;

  let q =
    "SELECT P.Pid, P.Fname, P.Lname, P.age, P.address, P.descr, P.contact, P.gender, DATE_FORMAT(A.AppDate, '%Y-%m-%d') AS AppDate FROM Patient P " +
    "JOIN approval AP ON P.Pid = AP.Pid " +
    "JOIN Doctor D ON AP.DrId = D.DrId " +
    "JOIN appointment A ON AP.DrId = A.DrId AND AP.Pid = A.Pid " +
    "WHERE D.DrId = ? AND AP.status = ?";
  const val = [id, 1];
  console.log("ID" + id);
  db.query(q, val, (err, result) => {
    if (err) return res.json(err);
    console.log("Res" + result);
    return res.json(result);
  });
});

app.get("/status/:id", (req, res) => {
  let id = req.params.id;
  const q = "select status from Approval where Pid=?";
  db.query(q, [id], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.get('/status/val/:id',(req,res)=>{
  let id=req.params.id;
  let q='select uname,RoomNo from user u,dept dp,Approval a,doctor d where u.uid=d.DrId and dp.Did=d.Did and u.uid=a.DrId and status=? and Pid=?'
  const val=[1,id];
  db.query(q,val,(err,data)=>{
    if(err) return res.json(err)
    return res.json(data);
  })
})
// app.post("/form");
app.listen(3001, () => {
  console.log("Server Running");
});
