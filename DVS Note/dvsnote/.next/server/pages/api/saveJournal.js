"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/saveJournal";
exports.ids = ["pages/api/saveJournal"];
exports.modules = {

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("mongodb");

/***/ }),

/***/ "next/dist/compiled/next-server/pages-api.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages-api.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages-api.runtime.dev.js");

/***/ }),

/***/ "(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2FsaveJournal&preferredRegion=&absolutePagePath=.%2Fsrc%5Cpages%5Capi%5CsaveJournal.js&middlewareConfigBase64=e30%3D!":
/*!**********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2FsaveJournal&preferredRegion=&absolutePagePath=.%2Fsrc%5Cpages%5Capi%5CsaveJournal.js&middlewareConfigBase64=e30%3D! ***!
  \**********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   routeModule: () => (/* binding */ routeModule)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/pages-api/module.compiled */ \"(api)/./node_modules/next/dist/server/route-modules/pages-api/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(api)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/build/templates/helpers */ \"(api)/./node_modules/next/dist/build/templates/helpers.js\");\n/* harmony import */ var _src_pages_api_saveJournal_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src\\pages\\api\\saveJournal.js */ \"(api)/./src/pages/api/saveJournal.js\");\n\n\n\n// Import the userland code.\n\n// Re-export the handler (should be the default export).\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_src_pages_api_saveJournal_js__WEBPACK_IMPORTED_MODULE_3__, 'default'));\n// Re-export config.\nconst config = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_src_pages_api_saveJournal_js__WEBPACK_IMPORTED_MODULE_3__, 'config');\n// Create and export the route module that will be consumed.\nconst routeModule = new next_dist_server_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__.PagesAPIRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.PAGES_API,\n        page: \"/api/saveJournal\",\n        pathname: \"/api/saveJournal\",\n        // The following aren't used in production.\n        bundlePath: '',\n        filename: ''\n    },\n    userland: _src_pages_api_saveJournal_js__WEBPACK_IMPORTED_MODULE_3__\n});\n\n//# sourceMappingURL=pages-api.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LXJvdXRlLWxvYWRlci9pbmRleC5qcz9raW5kPVBBR0VTX0FQSSZwYWdlPSUyRmFwaSUyRnNhdmVKb3VybmFsJnByZWZlcnJlZFJlZ2lvbj0mYWJzb2x1dGVQYWdlUGF0aD0uJTJGc3JjJTVDcGFnZXMlNUNhcGklNUNzYXZlSm91cm5hbC5qcyZtaWRkbGV3YXJlQ29uZmlnQmFzZTY0PWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDRTtBQUMxRDtBQUM4RDtBQUM5RDtBQUNBLGlFQUFlLHdFQUFLLENBQUMsMERBQVEsWUFBWSxFQUFDO0FBQzFDO0FBQ08sZUFBZSx3RUFBSyxDQUFDLDBEQUFRO0FBQ3BDO0FBQ08sd0JBQXdCLHlHQUFtQjtBQUNsRDtBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxZQUFZO0FBQ1osQ0FBQzs7QUFFRCIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhZ2VzQVBJUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL3BhZ2VzLWFwaS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IGhvaXN0IH0gZnJvbSBcIm5leHQvZGlzdC9idWlsZC90ZW1wbGF0ZXMvaGVscGVyc1wiO1xuLy8gSW1wb3J0IHRoZSB1c2VybGFuZCBjb2RlLlxuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi4vc3JjXFxcXHBhZ2VzXFxcXGFwaVxcXFxzYXZlSm91cm5hbC5qc1wiO1xuLy8gUmUtZXhwb3J0IHRoZSBoYW5kbGVyIChzaG91bGQgYmUgdGhlIGRlZmF1bHQgZXhwb3J0KS5cbmV4cG9ydCBkZWZhdWx0IGhvaXN0KHVzZXJsYW5kLCAnZGVmYXVsdCcpO1xuLy8gUmUtZXhwb3J0IGNvbmZpZy5cbmV4cG9ydCBjb25zdCBjb25maWcgPSBob2lzdCh1c2VybGFuZCwgJ2NvbmZpZycpO1xuLy8gQ3JlYXRlIGFuZCBleHBvcnQgdGhlIHJvdXRlIG1vZHVsZSB0aGF0IHdpbGwgYmUgY29uc3VtZWQuXG5leHBvcnQgY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgUGFnZXNBUElSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuUEFHRVNfQVBJLFxuICAgICAgICBwYWdlOiBcIi9hcGkvc2F2ZUpvdXJuYWxcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9zYXZlSm91cm5hbFwiLFxuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGFyZW4ndCB1c2VkIGluIHByb2R1Y3Rpb24uXG4gICAgICAgIGJ1bmRsZVBhdGg6ICcnLFxuICAgICAgICBmaWxlbmFtZTogJydcbiAgICB9LFxuICAgIHVzZXJsYW5kXG59KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFnZXMtYXBpLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2FsaveJournal&preferredRegion=&absolutePagePath=.%2Fsrc%5Cpages%5Capi%5CsaveJournal.js&middlewareConfigBase64=e30%3D!\n");

/***/ }),

/***/ "(api)/./src/lib/mongoUtil.js":
/*!******************************!*\
  !*** ./src/lib/mongoUtil.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   connectToDatabase: () => (/* binding */ connectToDatabase),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongodb */ \"mongodb\");\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_0__);\n// mongoUtil.js\n\nconst client = new mongodb__WEBPACK_IMPORTED_MODULE_0__.MongoClient('mongodb+srv://root:R5lcPSJm1egBE0Z1@dvsnotedb.lozto.mongodb.net/DVSDB?retryWrites=true&w=majority&appName=DVSNoteDB');\nlet dbConnection;\nasync function connectToDatabase() {\n    if (!dbConnection) {\n        const clientConnection = await client.connect();\n        dbConnection = clientConnection.db('DVSDB'); // Ensure 'DVSDB' is your actual database name\n    }\n    return dbConnection;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (connectToDatabase);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvbGliL21vbmdvVXRpbC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsZUFBZTtBQUN1QjtBQUV0QyxNQUFNQyxTQUFTLElBQUlELGdEQUFXQSxDQUFDO0FBRS9CLElBQUlFO0FBRUcsZUFBZUM7SUFDbEIsSUFBSSxDQUFDRCxjQUFjO1FBQ2YsTUFBTUUsbUJBQW1CLE1BQU1ILE9BQU9JLE9BQU87UUFDN0NILGVBQWVFLGlCQUFpQkUsRUFBRSxDQUFDLFVBQVUsOENBQThDO0lBQy9GO0lBQ0EsT0FBT0o7QUFDWDtBQUdBLGlFQUFlQyxpQkFBaUJBLEVBQUMiLCJzb3VyY2VzIjpbIkM6XFxNYWpvci1Hcm91cC1Qcm9qZWN0XFxEVlMgTm90ZVxcZHZzbm90ZVxcc3JjXFxsaWJcXG1vbmdvVXRpbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBtb25nb1V0aWwuanNcclxuaW1wb3J0IHsgTW9uZ29DbGllbnQgfSBmcm9tICdtb25nb2RiJztcclxuXHJcbmNvbnN0IGNsaWVudCA9IG5ldyBNb25nb0NsaWVudCgnbW9uZ29kYitzcnY6Ly9yb290OlI1bGNQU0ptMWVnQkUwWjFAZHZzbm90ZWRiLmxvenRvLm1vbmdvZGIubmV0L0RWU0RCP3JldHJ5V3JpdGVzPXRydWUmdz1tYWpvcml0eSZhcHBOYW1lPURWU05vdGVEQicpO1xyXG5cclxubGV0IGRiQ29ubmVjdGlvbjtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb25uZWN0VG9EYXRhYmFzZSgpIHtcclxuICAgIGlmICghZGJDb25uZWN0aW9uKSB7XHJcbiAgICAgICAgY29uc3QgY2xpZW50Q29ubmVjdGlvbiA9IGF3YWl0IGNsaWVudC5jb25uZWN0KCk7XHJcbiAgICAgICAgZGJDb25uZWN0aW9uID0gY2xpZW50Q29ubmVjdGlvbi5kYignRFZTREInKTsgLy8gRW5zdXJlICdEVlNEQicgaXMgeW91ciBhY3R1YWwgZGF0YWJhc2UgbmFtZVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRiQ29ubmVjdGlvbjtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3RUb0RhdGFiYXNlO1xyXG4iXSwibmFtZXMiOlsiTW9uZ29DbGllbnQiLCJjbGllbnQiLCJkYkNvbm5lY3Rpb24iLCJjb25uZWN0VG9EYXRhYmFzZSIsImNsaWVudENvbm5lY3Rpb24iLCJjb25uZWN0IiwiZGIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./src/lib/mongoUtil.js\n");

/***/ }),

/***/ "(api)/./src/pages/api/saveJournal.js":
/*!**************************************!*\
  !*** ./src/pages/api/saveJournal.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _lib_mongoUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/mongoUtil */ \"(api)/./src/lib/mongoUtil.js\");\n\nasync function handler(req, res) {\n    if (req.method !== 'POST') {\n        return res.status(405).json({\n            success: false,\n            message: 'Method not allowed'\n        });\n    }\n    try {\n        const { username, title, content, date } = req.body;\n        if (!username || !date || !content) {\n            console.error('Missing required fields:', {\n                username,\n                date,\n                content\n            });\n            return res.status(400).json({\n                success: false,\n                message: 'Missing required fields'\n            });\n        }\n        const db = await (0,_lib_mongoUtil__WEBPACK_IMPORTED_MODULE_0__.connectToDatabase)();\n        // Save the journal to the 'journals' collection\n        await db.collection('journals').updateOne({\n            username,\n            date\n        }, {\n            $set: {\n                title,\n                content\n            }\n        }, {\n            upsert: true\n        });\n        console.log('Journal saved successfully:', {\n            username,\n            title,\n            content,\n            date\n        });\n        return res.status(200).json({\n            success: true,\n            message: 'Journal saved successfully'\n        });\n    } catch (error) {\n        console.error('Error saving journal:', error);\n        return res.status(500).json({\n            success: false,\n            message: 'Error saving journal'\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL3NhdmVKb3VybmFsLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQXdEO0FBRXpDLGVBQWVDLFFBQVFDLEdBQUcsRUFBRUMsR0FBRztJQUM1QyxJQUFJRCxJQUFJRSxNQUFNLEtBQUssUUFBUTtRQUN6QixPQUFPRCxJQUFJRSxNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDO1lBQUVDLFNBQVM7WUFBT0MsU0FBUztRQUFxQjtJQUM5RTtJQUVBLElBQUk7UUFDRixNQUFNLEVBQUVDLFFBQVEsRUFBRUMsS0FBSyxFQUFFQyxPQUFPLEVBQUVDLElBQUksRUFBRSxHQUFHVixJQUFJVyxJQUFJO1FBRW5ELElBQUksQ0FBQ0osWUFBWSxDQUFDRyxRQUFRLENBQUNELFNBQVM7WUFDbENHLFFBQVFDLEtBQUssQ0FBQyw0QkFBNEI7Z0JBQUVOO2dCQUFVRztnQkFBTUQ7WUFBUTtZQUNwRSxPQUFPUixJQUFJRSxNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDO2dCQUFFQyxTQUFTO2dCQUFPQyxTQUFTO1lBQTBCO1FBQ25GO1FBRUEsTUFBTVEsS0FBSyxNQUFNaEIsaUVBQWlCQTtRQUVsQyxnREFBZ0Q7UUFDaEQsTUFBTWdCLEdBQUdDLFVBQVUsQ0FBQyxZQUFZQyxTQUFTLENBQ3ZDO1lBQUVUO1lBQVVHO1FBQUssR0FDakI7WUFBRU8sTUFBTTtnQkFBRVQ7Z0JBQU9DO1lBQVE7UUFBRSxHQUMzQjtZQUFFUyxRQUFRO1FBQUs7UUFHakJOLFFBQVFPLEdBQUcsQ0FBQywrQkFBK0I7WUFBRVo7WUFBVUM7WUFBT0M7WUFBU0M7UUFBSztRQUM1RSxPQUFPVCxJQUFJRSxNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDO1lBQUVDLFNBQVM7WUFBTUMsU0FBUztRQUE2QjtJQUNyRixFQUFFLE9BQU9PLE9BQU87UUFDZEQsUUFBUUMsS0FBSyxDQUFDLHlCQUF5QkE7UUFDdkMsT0FBT1osSUFBSUUsTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztZQUFFQyxTQUFTO1lBQU9DLFNBQVM7UUFBdUI7SUFDaEY7QUFDRiIsInNvdXJjZXMiOlsiQzpcXE1ham9yLUdyb3VwLVByb2plY3RcXERWUyBOb3RlXFxkdnNub3RlXFxzcmNcXHBhZ2VzXFxhcGlcXHNhdmVKb3VybmFsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNvbm5lY3RUb0RhdGFiYXNlIH0gZnJvbSAnLi4vLi4vbGliL21vbmdvVXRpbCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgcmVzKSB7XHJcbiAgaWYgKHJlcS5tZXRob2QgIT09ICdQT1NUJykge1xyXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA1KS5qc29uKHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6ICdNZXRob2Qgbm90IGFsbG93ZWQnIH0pO1xyXG4gIH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHsgdXNlcm5hbWUsIHRpdGxlLCBjb250ZW50LCBkYXRlIH0gPSByZXEuYm9keTtcclxuXHJcbiAgICBpZiAoIXVzZXJuYW1lIHx8ICFkYXRlIHx8ICFjb250ZW50KSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ01pc3NpbmcgcmVxdWlyZWQgZmllbGRzOicsIHsgdXNlcm5hbWUsIGRhdGUsIGNvbnRlbnQgfSk7XHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBtZXNzYWdlOiAnTWlzc2luZyByZXF1aXJlZCBmaWVsZHMnIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRiID0gYXdhaXQgY29ubmVjdFRvRGF0YWJhc2UoKTtcclxuXHJcbiAgICAvLyBTYXZlIHRoZSBqb3VybmFsIHRvIHRoZSAnam91cm5hbHMnIGNvbGxlY3Rpb25cclxuICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2pvdXJuYWxzJykudXBkYXRlT25lKFxyXG4gICAgICB7IHVzZXJuYW1lLCBkYXRlIH0sXHJcbiAgICAgIHsgJHNldDogeyB0aXRsZSwgY29udGVudCB9IH0sXHJcbiAgICAgIHsgdXBzZXJ0OiB0cnVlIH1cclxuICAgICk7XHJcblxyXG4gICAgY29uc29sZS5sb2coJ0pvdXJuYWwgc2F2ZWQgc3VjY2Vzc2Z1bGx5OicsIHsgdXNlcm5hbWUsIHRpdGxlLCBjb250ZW50LCBkYXRlIH0pO1xyXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgbWVzc2FnZTogJ0pvdXJuYWwgc2F2ZWQgc3VjY2Vzc2Z1bGx5JyB9KTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcignRXJyb3Igc2F2aW5nIGpvdXJuYWw6JywgZXJyb3IpO1xyXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6ICdFcnJvciBzYXZpbmcgam91cm5hbCcgfSk7XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJjb25uZWN0VG9EYXRhYmFzZSIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJtZXRob2QiLCJzdGF0dXMiLCJqc29uIiwic3VjY2VzcyIsIm1lc3NhZ2UiLCJ1c2VybmFtZSIsInRpdGxlIiwiY29udGVudCIsImRhdGUiLCJib2R5IiwiY29uc29sZSIsImVycm9yIiwiZGIiLCJjb2xsZWN0aW9uIiwidXBkYXRlT25lIiwiJHNldCIsInVwc2VydCIsImxvZyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/saveJournal.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2FsaveJournal&preferredRegion=&absolutePagePath=.%2Fsrc%5Cpages%5Capi%5CsaveJournal.js&middlewareConfigBase64=e30%3D!")));
module.exports = __webpack_exports__;

})();