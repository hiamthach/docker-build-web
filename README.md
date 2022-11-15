# Ba con chim lẻ loi App

App is created by React.

### Vừa clone source về

Chạy lệnh trên terminal:

- npm install -> để cài hết package cho project.
- npm start -> để chạy start project.

### Thư viện sử dụng:

- Ant Design -> Thư viện UI.
- redux -> Để quản lý các global state.
- reactflow -> Để kéo thả các objects và connections.
- sweetalert2 -> Để tạo các thông báo.
- jszip -> Để tạo zip folder.

### Cấu trúc dự án:

1. assets: gồm img để chứa hình ảnh, styles: để chứa các styles chung.
2. components: để chứa các components(vd như button để tái sử dụng lại) chung để tái sử dụng.
3. config: folders này để sẵn chưa dùng tới.
4. containers: chứa các containers chung(Sidebar và Phần canva để kéo thả trên đó).
5. layout: là layout giao diện ngoài.
6. redux: để chứa các slice của redux.
7. utils: để chứa các hàm để tái sử dụng lại.

\*\*Trong code phần react flow thì Edges sẽ hiểu là Connections.

\*\*Thứ tự đọc code: App -> layout -> containers -> redux -> components, assets, utils,...

### Link tham khảo:

- Ant Design Components: https://ant.design/components/overview/
- React Flow: https://reactflow.dev/docs/guides/uncontrolled-flow/
- Redux: https://redux-toolkit.js.org/tutorials/quick-start
