import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePageLayout from "./HomePageLayout";
import ToolPageLayout from "./ToolPageLayout";
import BadgerBudsLanding from "./pages/BadgerBudsLanding";
import Tool1 from "./pages/tool1";
import Tool2 from "./pages/tool2";
import Tool3 from "./pages/tool3";
import Tool4 from "./pages/tool4";

export default function BadgerBudsRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<HomePageLayout />}>
                    <Route path="/" element={<BadgerBudsLanding />} />
                </Route>
                <Route element={<ToolPageLayout />}>
                    <Route path="tool1" element={<Tool1 />} />
                    <Route path="tool2" element={<Tool2 />} />
                    <Route path="tool3" element={<Tool3 />} />
                    <Route path="tool4" element={<Tool4 />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
