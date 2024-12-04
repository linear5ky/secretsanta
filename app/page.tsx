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
    // Shuffle participants randomly
    const shuffled = [...participants].sort(() => 0.5 - Math.random());

    const assigned = [];

    // Assign each participant to the next one in the shuffled
    for (let i = 0; i < shuffled.length; i++) {
      const santa = shuffled[i];
      console.log("santa" + santa);
      const recipient = shuffled[(i + 1) % shuffled.length]; // Wrap around for last participant
      assigned.push({ ...santa, assignedTo: recipient.name }); // Assign Santa to Recipient
    }

    setParticipants(assigned);

    //Send SMS via Twilio API
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
            <CardTitle className="text-4xl font-bold text-center text-gray-800">
              Secret Santa
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
