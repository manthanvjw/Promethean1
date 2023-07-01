import React, {useEffect, useState, Fragment} from "react";

import { 
    RosConnection, 
    ImageViewer, 
    Subscriber, 
    TopicListProvider, 
    useMsg, 
    useTopicList, 
    Publisher, 
    Param, 
    useParam, 
    ParamListProvider, 
    useParamList, 
    ServiceListProvider, 
    useServiceList, 
    ServiceCaller, 
    ServiceServer
} from "rosreact";

function App() {

    const [trigger, setTrigger] = useState(false);
    const [delParam, setDelParam] = useState(false);
    const [message, setMessage] = useState({data: 0});

    useEffect(() => {
        setTimeout(() => {
            setTrigger(!trigger);
        }, 3000);
    }, [trigger])

    useEffect(() => {
        setTimeout(() => {
            setMessage({data: 4});
        }, 3000);
    }, [])

    useEffect(() => {
        setTimeout(() => {
            setDelParam(true);
        }, 10000);
    }, [])

    return (
        <div>
            {/* All ROS components are wrapped into a RosConnection */}
            <RosConnection url={"ws://127.0.0.1:9090"} autoConnect>
                
                <Subscriber
                    topic="/number"
                    messageType="std_msgs/Float32"
                >
                    <MsgView/>
                </Subscriber>
                
                <Param 
                    name="/react/param"
                    setValue={1}
                    get={trigger}
                    delete={delParam}
                    deleteCallback={(resp) => {console.log(resp)}}
                    setCallback={(resp) => {console.log(resp)}}
                >
                    <ParamView/>
                </Param>
                
                <Publisher 
                    autoRepeat 
                    topic="/react/pub/repeat"
                    throttleRate={10.0} 
                    message={{data: 2}} 
                    messageType="std_msgs/Float32"
                />
                
                <Publisher 
                    topic="/react/pub/norepeat"
                    throttleRate={10.0} 
                    message={message} 
                    messageType="std_msgs/Float32"
                    latch={true}
                />

                <ServiceServer 
                    name="/react/service" 
                    serviceType="std_srvs/SetBool" 
                    callback={serviceServerCallback}
                />

                <ServiceCaller 
                    name="/setbool" 
                    serviceType="std_srvs/SetBool" 
                    request={{data: true}} 
                    trigger={trigger}
                    callback={(resp) => {console.log(resp)}} 
                    failedCallback={(error) => {console.log(error)}}
                />
                
                <TopicListProvider
                    trigger={trigger} 
                    failedCallback={(e) => {console.log(e)}}
                >
                    <TopicListView/>
                </TopicListProvider>
                
                <ServiceListProvider
                    trigger={trigger}
                    failedCallback={(e) => {console.log(e)}}
                >
                    <ServiceListView/>
                </ServiceListProvider>
                
                <ParamListProvider
                    trigger={trigger} 
                    failedCallback={(e) => {console.log(e)}}
                >
                    <ParamListView/>
                </ParamListProvider>
            
            </RosConnection>
            
            <ImageViewer topic="/camera"/>
        </div>
    )
}

const serviceServerCallback = (request, response) => {
    if (request.data === true) {
        response.success = true;
        response.message = "Passed true value";
    } else {
        response.success = false;
        response.message = "Passed false value";
    }
}

const ParamView = () => {
    const param = useParam();
    return <p>{`${param}`}</p>
}


const MsgView = () => {
    const msg = useMsg();
    return <p> {`${msg.distance}`} </p>
}


const TopicListView = () => {
    const topicList = useTopicList();
    return ( 
        <Fragment>
        <p>{`${topicList.topics}`}</p>
        <p>{`${topicList.types}`}</p>
        </Fragment>
    );
}


const ServiceListView = () => {
    const list = useServiceList();
    return (
        <p>{`${list}`}</p>
    );
}


const ParamListView = () => {
    const list = useParamList();
    return ( 
        <p>{`${list}`}</p>
    );
}

export default App;