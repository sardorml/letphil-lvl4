import { useEffect, useState } from "react";
import { PollsList, type Poll } from "@/components/PollsList";
import { toast } from "sonner";

function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>();

  async function fetchPolls() {
    try {
      const response = await fetch("http://localhost:3005/polls");
      const data: Poll[] = await response.json();

      setPolls(data);
    } catch (error) {
      console.log(error);
    }
  }

  const userId = localStorage.getItem("userId");

  async function deletePoll(id: string) {
    if (!userId) {
      toast.error("not logged in");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3005/poll/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });
      const data = await response.json();
      setPolls(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchPolls();
  }, []);

  if (!polls) {
    return (
      <div className="flex justify-center items-center mt-10">Loading...</div>
    );
  }

  return (
    <div className="flex justify-center">
      <PollsList onDelete={deletePoll} polls={polls} />
    </div>
  );
}

export default PollsPage;
