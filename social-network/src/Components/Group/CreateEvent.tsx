import { UserContext } from '../App/App';
import { useContext, useState } from 'react';

interface iFormKeys {
    [key: string]: {
        [key: string]: string | number | undefined;
    };
}

interface iForm extends iFormKeys {
    event: {
        title: string;
        group_id: number;
        description: string;
        start_date_time: string;
        end_date_time: string;
    };
}

export default function CreateEvent({ groupID }: { groupID: number }) {
    const [eventData, setEventData] = useState<iForm>({
        event: {
            title: '',
            group_id: groupID,
            description: '',
            start_date_time: '',
            end_date_time: '',
        },
    });

    const handleEventSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const FD = new FormData();
        FD.append('title', eventData.event.title);
        FD.append('group_id', eventData.event.group_id.toString());
        FD.append('description', eventData.event.description);
        FD.append('start_date_time', eventData.event.start_date_time);
        FD.append('end_date_time', eventData.event.end_date_time);
        const response = await fetch('http://localhost:8080/api/event/create', {
            method: 'POST',
            credentials: 'include',
            body: FD,
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
        } else {
            console.log('something went wrong');
        }
    };

    return (
        <>
            <div className="create-event m-2 w-full">
                <div className="create-event__form">
                    <h2 className="font-bold text-center text-md mb-1">
                        Create your event
                    </h2>
                    <form
                        onSubmit={(e) => {
                            handleEventSubmit(e);
                        }}
                        className="bg-blue-50 p-6 rounded-xl"
                    >
                        <div className="form__group">
                            <input
                                onChange={(e) => {
                                    const eventCopy = eventData;
                                    eventCopy.event.title = e.target.value;
                                    setEventData(eventCopy);
                                }}
                                type="text"
                                className="mt-0 w-full"
                                name="title"
                                id="title"
                                placeholder="title"
                            />
                        </div>
                        <div className="form__group mt-2">
                            <textarea
                                onChange={(e) => {
                                    const eventCopy = eventData;
                                    eventCopy.event.description =
                                        e.target.value;
                                    setEventData(eventCopy);
                                }}
                                className="w-full rounded-md mb-0 text-sm p-2"
                                name="description"
                                id="description"
                                placeholder="Describe this event"
                            />
                        </div>
                        <div className="form__group mt-1">
                            <input
                                onChange={(e) => {
                                    const eventCopy = eventData;
                                    eventCopy.event.start_date_time =
                                        e.target.value;
                                    setEventData(eventCopy);
                                }}
                                type="time"
                                className="mt-0 w-full"
                                name="startTime"
                                id="startTime"
                                placeholder="start time"
                            />
                        </div>
                        <div className="form__group mt-1">
                            <input
                                onChange={(e) => {
                                    const eventCopy = eventData;
                                    eventCopy.event.end_date_time =
                                        e.target.value;
                                    setEventData(eventCopy);
                                }}
                                type="date"
                                className="mt-0 w-full"
                                name="date"
                                id="date"
                                placeholder="date"
                            />
                        </div>
                        <div className="form__group button-custom text-center bg-blue-100 font-bold rounded-xl mt-2 p-2">
                            <button>Create event</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
