import {signal} from "@preact/signals";
import {createContext} from "preact";
import {useContext, useEffect} from "preact/hooks";
import {useLocation, useRoute} from "preact-iso";

const example_data = [{id: 1, name: "Foo"}, {id: 2, name: "Bar"}]

const createState = () => {
    const selection_list = signal(null);
    const selected_item = signal(null);

    return {
        selection_list,
        selected_item
    };
};

const State = createContext(undefined);

const FooPage = () => (
    <State.Provider value={createState()}>
        <Page />
    </State.Provider>
);

const Page = () => {
    const state = useContext(State);
    const {params} = useRoute();

    useEffect(() => {
        state.selection_list.value = example_data
    }, [state.selection_list]);

    return (
        <main>
            <div id="selection">
                {!params?.id
                    ? <SelectionList />
                    : <SelectionDetails />}
            </div>
        </main>
    );
};

const SelectionList = () => {
    const state = useContext(State);

    return (
        <>
            <h1>
                Selection
            </h1>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                </tr>
                </thead>
                <tbody>
                {state.selection_list.value?.map((item) => (
                    <tr key={item.id}>
                        <td><a href={`/${item.id}`}>{item.id}</a></td>
                        <td>{item.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}

const SelectionDetails = () => {
    const state = useContext(State);
    const {params} = useRoute();


    useEffect(() => {
        // mocked fetch async response
        new Promise((resolve) => {
            setTimeout(() => {
                resolve(example_data.find(item => item.id === parseInt(params.id, 10)));
            }, 300);
        }).then(res => state.selected_item.value = res)
    }, [state.selected_item, params.id]);

    return (
        <>
            <h1>
                Selection
                <span
                    class="selected">&nbsp;
                    {state.selected_item.value?.name}
                </span>
            </h1>

            <Tabs base_url={`/${params.id}`}
                  tabs={[
                      {
                          name: "First",
                          id: "first",
                          pos: 0,
                          target: <p>Tab 1</p>
                      },
                      {
                          name: "Second",
                          id: "second",
                          pos: 1,
                          target: <p>Tab 2</p>
                      }]} />
        </>
    )
}

const Tabs = ({base_url, tabs, param_name = "tab"}) => {
    const {params} = useRoute();
    const {route, path} = useLocation();
    const tab = params[param_name]

    if (tab === null) {
        route(`${path}/$tabs[0].id}`)
    }

    const change_tab = (event, current_tab) => {
        if (event.key === 'ArrowRight') {
            const new_tab = tabs[
                tabs.length !== current_tab.pos + 1
                    ? current_tab.pos + 1
                    : 0];
            document.getElementById(`${param_name}-${new_tab.id}`).focus()
            route(`${base_url}/${new_tab.id}`);
        } else if (event.key === 'ArrowLeft') {
            const new_tab = tabs[
                0 !== current_tab.pos
                    ? current_tab.pos - 1
                    : tabs.length - 1];
            document.getElementById(`${param_name}-${new_tab.id}`).focus()
            route(`${base_url}/${new_tab.id}`);

        }
    }

    return (
        <div class="tabs" id="process-details-tabs">
            <div class="tab-selection" role="tablist"
                 aria-labelledby="tablist-1">

                {tabs.map(tab_name => {
                        return (
                            <a key={`tablist-${tab_name.id}`}
                               id={`${param_name}-${tab_name.id}`}
                               role="tab"
                               aria-selected={tab === tab_name.id}
                               aria-controls={`tabpanel-${tab_name.id}}`}
                               href={`${base_url}/${tab_name.id}`}
                               tabIndex={tab !== tab_name.id ? '-1' : null}
                               onKeyDown={(event) => change_tab(event, tab_name)}
                            >
                                {tab_name.name}
                            </a>)
                    }
                )}
            </div>
            <div class="selected-tab"
                 id={`tabpanel-${tab}`}
                 role="tabpanel"
                 tabIndex="0"
                 aria-labelledby={`${param_name}-${tab}`}>
                {tabs.find(tab_ => tab === tab_.id)?.target || "Select a tab"}
            </div>
        </div>
    );
}

export {FooPage}