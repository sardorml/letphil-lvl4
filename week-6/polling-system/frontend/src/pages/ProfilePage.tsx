import { PollsList, type Poll } from "@/components/PollsList";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type UserInfo = {
  id: string;
  polls: Poll[];
};

export default function ProfilePage() {
  const userId = localStorage.getItem("userId");
  const [userInfo, setUserInfo] = useState<UserInfo>();

  async function fetchUserInfo() {
    try {
      const response = await fetch(`http://localhost:3005/users/${userId}`);
      const data = await response.json();

      setUserInfo(data);
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  async function deletePoll(id: string) {
    if (!userId) {
      toast.error("not logged in");
      return;
    }

    try {
      await fetch(`http://localhost:3005/poll/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });
      fetchUserInfo();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (userId) {
      fetchUserInfo();
    }
  }, [userId]);

  if (!userInfo) {
    return <div className="flex justify-center mt-10">Loading...</div>;
  }

  return (
    <div>
      <PollsList onDelete={deletePoll} polls={userInfo.polls} />
    </div>
  );
}
