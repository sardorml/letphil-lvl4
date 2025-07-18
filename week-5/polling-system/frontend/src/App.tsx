import "./App.css";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Label } from "./components/ui/label";
import { useState } from "react";

function App() {
  const [options, setOptions] = useState([
    {
      label: "Option 1",
      htmlFor: "option-1",
      id: "option-1",
    },
  ]);

  function addToOptions() {
    setOptions((prev) => [
      ...prev,
      {
        label: `Option ${prev.length + 1}`,
        htmlFor: `option-${prev.length + 1}`,
        id: `option-${prev.length + 1}`,
      },
    ]);
  }

  function deleteOption(index: number) {
    const filteredOptions = options.filter((_, i) => i != index);

    const updatedOptions = filteredOptions.map((_, index) => {
      return {
        label: `Option ${index + 1}`,
        htmlFor: `option-${index + 1}`,
        id: `option-${index + 1}`,
      };
    });

    setOptions(updatedOptions);
  }

  async function createPoll(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const questionInput = form.elements.namedItem(
      "question"
    ) as HTMLInputElement;

    const optionsInputs = [];

    for (const option of options) {
      const optionInput = form.elements.namedItem(
        option.id
      ) as HTMLInputElement;

      optionsInputs.push({
        text: optionInput.value,
      });
    }

    const pollData = {
      question: questionInput.value,
      activeDays: 1,
      options: optionsInputs,
    };

    const response = await fetch("http://localhost:3005/poll/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pollData),
    });

    console.log(pollData);
    console.log(await response.json());
  }

  return (
    <div>
      <h1 className="text-7xl font-semibold text-center mt-10">
        Polling system
      </h1>
      <div className="flex min-h-svh flex-col items-center mt-40">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Create a poll</CardTitle>
            <CardDescription>Enter poll details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={createPoll}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="question">Qestion</Label>
                  <Input
                    id="question"
                    type="text"
                    placeholder="Question"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  {options.map((option, index) => (
                    <div key={option.id} className="flex flex-col gap-2">
                      <div className="flex items-center">
                        <Label htmlFor={option.htmlFor}>{option.label}</Label>
                      </div>
                      <div className="flex gap-4">
                        <Input id={option.id} type="text" required />
                        <Button
                          variant="destructive"
                          onClick={() => {
                            deleteOption(index);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col mt-8 gap-3">
                <Button className="w-full" onClick={addToOptions}>
                  Add option
                </Button>
                <Button type="submit" className="w-full">
                  Create
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
