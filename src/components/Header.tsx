import { Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Header = () => {
    const [taskName, setTaskName] = useState(
        localStorage.getItem("taskName") || "Task Name"
      );
      const [tableName, setTableName] = useState(
        localStorage.getItem("tableName") || "Table Name"
      );

      const [isEditingTask, setIsEditingTask] = useState(false);
      const [isEditingTable, setIsEditingTable] = useState(false);


      useEffect(() => {
        localStorage.setItem("taskName", taskName);
      }, [taskName]);
    
      useEffect(() => {
        localStorage.setItem("tableName", tableName);
      }, [tableName]);
    
      const handleTaskClick = () => {
        setIsEditingTask(true);
      };
    
      const handleTableClick = () => {
        setIsEditingTable(true);
      };
    
      const handleTaskBlur = () => {
        setIsEditingTask(false);
      };
    
      const handleTableBlur = () => {
        setIsEditingTable(false);
      };


  return (
    <div>
       <div className="headings" style={{ marginTop: "80px" }}>
        <div className="inner-headings">
          {isEditingTask ? (
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              onBlur={handleTaskBlur}
              autoFocus
              style={{
                fontSize: "40px",
                fontWeight: "bold",
                border: "none",
                outline: "none",
                textDecoration: "underline",
              }}
            />
          ) : (
            <Heading
              onClick={handleTaskClick}
              style={{
                cursor: "pointer",
                fontSize: "40px",
                fontWeight: "bold",
                border: "none",
                outline: "none",
                
              }}
              color={"gray.500"}
            >
              {taskName}
            </Heading>
          )}

          {isEditingTable ? (
            <input
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              onBlur={handleTableBlur} // Handle when input loses focus
              autoFocus // Automatically focus on the input when editing starts
              style={{
                fontSize: "16px",
                fontWeight: "400",
                border: "none",
                outline: "none",
                textDecoration: "underline",
              }}
            />
          ) : (
            <Heading
              onClick={handleTableClick}
              style={{
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "450",
                border: "none",
                outline: "none",
               
              }}
              color={"gray.400"}
            >
              {tableName}
            </Heading>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header

