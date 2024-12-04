"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GiftIcon, UserPlusIcon, PhoneIcon } from "lucide-react";

type Participant = {
  name: string;
  phone: string;
  assignedTo?: string;
};

export default function SecretSanta() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const addParticipant = () => {
    if (name && phone) {
      setParticipants([...participants, { name, phone }]);
      setName("");
      setPhone("");
      alert(`${name} added with phone number ${phone}`);
    } else {
      alert("Please provide both name and phone number for the participant.");
    }
  };

  const assignSecretSantas = async () => {
    if (participants.length < 2) {
      alert("You need at least 2 participants to assign Secret Santas.");
      return;
    }

    const shuffled = [...participants].sort(() => 0.5 - Math.random());

    let assigned = [];
    for (let i = 0; i < shuffled.length; i++) {
      const santa = shuffled[i];
      const recipient = shuffled[(i + 1) % shuffled.length]; // Circular assignment
      assigned.push({ ...santa, assignedTo: recipient.name });
    }

    setParticipants(assigned);

    // Simulate sending SMS notifications
    // Send SMS notifications via Twilio API
    for (const participant of assigned) {
      try {
        const response = await fetch("/sms/api", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: participant.phone,
            message: `Hi ${participant.name}, you are Secret Santa for ${participant.assignedTo}!`,
          }),
        });

        const result = await response.json();
        if (!result.success) {
          console.error(
            `Failed to send SMS to ${participant.phone}: ${result.error}`
          );
        }
      } catch (error) {
        console.error(`Error sending SMS to ${participant.phone}:`, error);
      }
    }

    alert("Secret Santas assigned and notifications sent!");
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="container mx-auto pt-8">
        <Card className="bg-white shadow-xl">
          <CardHeader className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-24 h-24 mb-4"
            >
              <path
                fill="#C41E3A"
                d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm0 448c-106 0-192-86-192-192S150 64 256 64s192 86 192 192-86 192-192 192z"
              />
              <path
                fill="#C41E3A"
                d="M256 128c-70.7 0-128 57.3-128 128s57.3 128 128 128 128-57.3 128-128-57.3-128-128-128zm0 224c-52.9 0-96-43.1-96-96s43.1-96 96-96 96 43.1 96 96-43.1 96-96 96z"
              />
              <path
                fill="#FFFFFF"
                d="M256 192c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm0 96c-17.6 0-32-14.4-32-32s14.4-32 32-32 32 14.4 32 32-14.4 32-32 32z"
              />
              <path
                fill="#C41E3A"
                d="M256 224c-17.6 0-32 14.4-32 32s14.4 32 32 32 32-14.4 32-32-14.4-32-32-32z"
              />
            </svg>
            <CardTitle className="text-4xl font-bold text-center text-gray-800">
              Secret Santa Organizer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                Add Participant
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                </div>
                <Button
                  onClick={addParticipant}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <UserPlusIcon className="mr-2 h-4 w-4" /> Add Participant
                </Button>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                Participants
              </h2>
              <ul className="space-y-2">
                {participants.map((participant, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-2 text-gray-700"
                  >
                    <GiftIcon className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold">{participant.name}</span>
                    <span className="flex items-center text-sm text-gray-500">
                      <PhoneIcon className="h-4 w-4 mr-1" />
                      {participant.phone}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <Button
                onClick={assignSecretSantas}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <GiftIcon className="mr-2 h-4 w-4" /> Assign Secret Santas &
                Send Notifications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
