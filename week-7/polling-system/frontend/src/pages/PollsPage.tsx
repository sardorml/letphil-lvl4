import { useEffect, useState } from "react";
import { PollsList, type Poll } from "@/components/PollsList";
import { toast } from "sonner";

function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>();
  const [loading, setLoading] = useState<boolean>(false);

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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPolls();
  }, []);

  if (loading || !polls) {
    return (
      <div className="flex justify-center items-center mt-10">Loading...</div>
    );
  }

  if (polls.length == 0) {
    return (
      <div className="flex justify-center items-center mt-10">
        No polls created yet
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <PollsList onDelete={deletePoll} polls={polls} isLoading={loading} />
    </div>
  );
}

export default PollsPage;
