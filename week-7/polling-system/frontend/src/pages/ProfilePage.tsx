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
  const [loading, setLoading] = useState<boolean>(false);

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
    setLoading(true);
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
    } finally {
      setLoading(false);
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
  if (userInfo.polls.length == 0) {
    return (
      <div className="flex justify-center items-center mt-10">
        No polls created yet
      </div>
    );
  }

  return (
    <div>
      <PollsList
        onDelete={deletePoll}
        polls={userInfo.polls}
        isLoading={loading}
      />
    </div>
  );
}
