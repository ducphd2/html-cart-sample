let data = {
  order_date: "2024-05-21T06:51:30.016Z",
  biz_id: "65281e26320f04ab76b6a08f",
  customer: {
    id: "6618e23cdf19e5312a99420f",
    pid: "fb24518838787715449",
    page_pid: "fb114380591682194",
    platform: "facebook",
    name: "Ngọc Đặng Xuân",
    last_name: "Ngọc Đặng Xuân",
    picture:
      "https://platform-lookaside.fbsbx.com/platform/profilepic/?eai=AXF7XkUOfBeB85qilL3u65GEg0VpVJ7nEfm6LUrI1rWIYvnzYh_aOHdTdZO64cguwc6soVpaQLNR&psid=24518838787715449&width=300&ext=1715498813&hash=AbYYBeZqEYR8MUk8kvl07IUQ",
    phone: "+84961885605",
    ward: "Hoằng quang",
    district: "Tp.Thanh hoá",
    province: "Thanh hoá",
    address: "Thôn Nguyệt Viên 3, Hoằng quang, Tp.Thanh hoá, Thanh hoá",
    street: "Thôn Nguyệt Viên 3",
  },
  code: "DH0064",
  status: "DRAFT",
  amount: 10000,
  total_product: 1,
  note: "Giao giờ hành chính nhé",
  carts: [
    {
      product_id: "664bf9272a25f766eaef5503",
      product_category_ids: [],
      product_category_names: ["mỹ phẩm, làm đẹp"],
      name: "Bông tẩy trang 3 lớp",
      desc: "100% bông tự nhiên",
      picture: "",
      quantity: 2,
      price: 10000,
      sale_price: 5000,
    },
  ],
  currency: "VND",
};

function calculateTotal(cartItems) {
  return cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

function createProxy(obj) {
  return new Proxy(obj, {
    set(target, property, value) {
      target[property] = value;
      data.amount = calculateTotal(data.carts) + (data.delivery_cost || 0);
      amount.textContent = data.amount + "đ";
      amount_pre.textContent = calculateTotal(data.carts) + "đ";
      return true;
    },
    get(target, property) {
      if (typeof target[property] === "object" && target[property] !== null) {
        return createProxy(target[property]);
      }
      return target[property];
    },
  });
}

const total_porduct = document.getElementById("total-porduct");
const amount = document.getElementById("amount");
const amount_pre = document.getElementById("amount-pre");
const delivery_cost = document.getElementById("delivery-cost");

let proxiedData = createProxy(data);
function sendRequest() {
  const url = "https://api.countrystatecity.in/v1/countries";
  const apiKey = "QkZVaWNMQlRBVzhWOVJOZ3dsVVhQeGxCYlhJMzRJdFp5QUQzVXQyNg==";

  const headers = new Headers();
  headers.append("X-CSCAPI-KEY", apiKey);

  return from(
    fetch(url, { method: "GET", headers: headers, redirect: "follow" }).then(
      (response) => response.json()
    )
  ).pipe(
    catchError((error) => {
      console.error("Error:", error);
      return throwError(error);
    })
  );
}

function getStatesByCountry(countryCode) {
  const url = `https://api.countrystatecity.in/v1/countries/${countryCode}/states`;
  const apiKey = "QkZVaWNMQlRBVzhWOVJOZ3dsVVhQeGxCYlhJMzRJdFp5QUQzVXQyNg==";

  const headers = new Headers();
  headers.append("X-CSCAPI-KEY", apiKey);

  return from(
    fetch(url, { method: "GET", headers: headers, redirect: "follow" }).then(
      (response) => response.json()
    )
  ).pipe(
    catchError((error) => {
      return throwError(error);
    })
  );
}

function getCitiesByState(countryCode, stateCode) {
  const url = `https://api.countrystatecity.in/v1/countries/${countryCode}/states/${stateCode}/cities`;
  const apiKey = "QkZVaWNMQlRBVzhWOVJOZ3dsVVhQeGxCYlhJMzRJdFp5QUQzVXQyNg==";

  const headers = new Headers();
  headers.append("X-CSCAPI-KEY", apiKey);

  return from(
    fetch(url, { method: "GET", headers: headers, redirect: "follow" }).then(
      (response) => response.json()
    )
  ).pipe(
    catchError((error) => {
      return throwError(error);
    })
  );
}

function initData() {
  amount.textContent = data.amount + "đ";
  amount_pre.textContent = calculateTotal(data.carts) + "đ";
  const productList = document.getElementById("product-list");
  if (productList) {
    productList.innerHTML = `
    <div class="d-flex justify-content-between w-100">
      <span class="text-size-2">Sản phảm đặt mua</span>
      <span class="text-size-1 text-red">${data.carts.length} sản phẩm</span>
    </div>
  `;
    data.carts.forEach(function (product, index) {
      productList.innerHTML += `
      <div class="d-flex justify-content-between w-100">
      <div class="d-flex gap-3 w-100">
        <img class="img-product" src="Img/product-1.png" alt="" />
        <div class="w-100 overflow-hidden d-flex flex-column justify-content-between">
          <div>
            <div class="text-size-1 text-truncate">${product.name}</div>
            <div class="text-size-9 text-gray text-truncate">Phân loại: ${product.product_category_names.join(
              ", "
            )}</div>
          </div>
          <div class="d-flex justify-content-between">
            <div>
              <span class="font-weight-600 text-size-1 text-orange">${
                product.sale_price + "đ"
              }</span>
              <span class="text-gray text-line-through text-size-9">${
                product.price
              }</span>
            </div>
            <div class="d-flex align-items-center">
              <button style="height: 24px; margin-top: 2px;" class="minus-product" id="add-product-${index}"><img src="Img/minus-circle.svg" alt=""></button>
              <input style="width: 24px;" type="number" min="0" class="carts-quantity"  id="carts-quantity-${index}" value="${
        product.quantity
      }" />
              <button style="height: 24px;" class="add-product" id="minus-product-${index}"><img src="Img/add-circle.svg" alt=""></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

      // const add = document.getElementById(`add-product-${index}`);
      // add.addEventListener("click", function (e) {
      //   data.carts[index].quantity += 1;
      // });

      // const minus = document.getElementById(`minus-product-${index}`);
      // minus.addEventListener("click", function (e) {
      //   data.carts[index].quantity -= 1;
      // });
    });
  }
  const carts_quantity = document.querySelectorAll(`.carts-quantity`);
  const adds = document.querySelectorAll(`.add-product`);
  adds.forEach((item, index) => {
    item.addEventListener("click", function (e) {
      proxiedData.carts[index].quantity += 1;
      carts_quantity[index].value = proxiedData.carts[index].quantity;
    });
  });

  const minues = document.querySelectorAll(`.minus-product`);
  minues.forEach((item, index) => {
    item.addEventListener("click", function (e) {
      if (proxiedData.carts[index].quantity > 1) {
        proxiedData.carts[index].quantity -= 1;
      }
      carts_quantity[index].value = proxiedData.carts[index].quantity;
    });
  });

  carts_quantity.forEach((item, i) => {
    item.addEventListener("input", function () {
      if (item.value < 1) {
        item.value = 1;
      }
      proxiedData.carts[i].quantity = item.value;
    });
  });

  const customer_name = document.getElementById("customer-name");
  const customer_phone = document.getElementById("customer-phone");
  const customer_address = document.getElementById("customer-address");
  const customer_note = document.getElementById("customer-note");
  customer_name.value = data.customer.name;
  customer_phone.value = data.customer.phone;
  customer_address.value = data.customer.address;
  customer_name.addEventListener("input", function () {
    data.customer.name = customer_name.value;
  });
  customer_phone.addEventListener("input", function () {
    data.customer.phone = customer_phone.value;
  });
  customer_address.addEventListener("input", function () {
    data.customer.address = customer_address.value;
  });
  customer_note.addEventListener("input", function () {
    data.note = customer_note.value;
  });

  var navLinks = document.querySelectorAll(".tab-nav a");
  var contentSections = document.querySelectorAll(".tab-content");

  if (navLinks.length && contentSections.length) {
    for (var i = 1; i < contentSections.length; i++) {
      contentSections[i].style.display = "none";
    }

    navLinks[0].classList.add("active");

    navLinks.forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();

        navLinks.forEach(function (nav) {
          nav.classList.remove("active");
        });

        link.classList.add("active");

        contentSections.forEach(function (section) {
          section.style.display = "none";
        });

        var target = document.querySelector(link.getAttribute("href"));
        target.style.display = "block";
      });
    });
  }

  const confirm = document.getElementById("confirm");
  confirm.addEventListener("click", function (e) {
    console.log('data:::', data);
    if (
      !data.customer.name ||
      !data.customer.phone ||
      !data.customer.address ||
      !data.delivery_cost
    ) {
      if (!data.customer.name) {
        customer_name.focus();
      } else if (!data.customer.phone) {
        customer_phone.focus();
      } else if (!data.customer.address) {
        customer_address.focus();
      }
      return;
    }
    const pay_body = document.getElementById("pay-body");

    const productHTML = data.carts
      .map(
        (product) => `
    <div class="d-flex justify-content-between border-radius w-100">
          <div class="d-flex gap-3 w-100">
            <img
              style="border-radius: unset"
              class="img-product"
              src="Img/product-1.png"
              alt=""
            />
            <div class="w-100 d-flex flex-column justify-content-between">
              <div>
                <div class="text-size-1">${product.name}</div>
                <div class="text-size-9 text-gray">
                  Phân loại: ${product.product_category_names.join(", ")}
                </div>
              </div>
              <div class="d-flex justify-content-between">
                <div>
                  <span class="font-weight-600 text-size-1 text-orange"
                    >${product.sale_price}</span
                  >
                  <span class="text-gray text-line-through text-size-9"
                    >${product.price}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
`
      )
      .join("");

    pay_body.innerHTML = `
    <div class="full-screen px-16 py-12 gap-2">
        <div class="d-flex justify-content-between w-100">
          <div class="d-flex align-items-center gap-1">
            <span class="text-size-2 font-weight-600">Thông tin đơn hàng</span>
          </div>
        </div>
        <div class="d-flex flex-column boder-input-group w-100">
          <div class="d-flex justify-content-between boder-input gap-3">
            <img src="Img/receipt-2.svg" alt="" />
            <div class="w-100">
              <div class="text-size-2 font-weight-500">Mã đơn hàng</div>
              <div class="text-size-2 font-weight-500 text-red">${
                data.code
              }</div>
            </div>
          </div>
          <div class="d-flex justify-content-between boder-input gap-3">
            <img src="Img/box-add.svg" alt="" />
            <div class="w-100">
              <div class="text-size-2 font-weight-500">Trạng thái đơn hàng</div>
              <div class="text-size-2 font-weight-500 text-green">${
                data.status
              }</div>
            </div>
          </div>
          <div class="d-flex justify-content-between boder-input gap-3">
            <img src="Img/calendar.svg" alt="" />
            <div class="w-100">
              <div class="text-size-2 font-weight-500">Ngày đặt hàng</div>
              <div class="text-size-2 font-weight-400 text-gray">
                ${formatDate(data.order_date)}
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-between boder-input gap-3">
            <img src="Img/wallet-money.svg" alt="" />
            <div class="w-100">
              <div class="text-size-2 font-weight-500">Tổng tiền hàng</div>
              <div class="text-size-2 font-weight-500 text-orange">
                ${data.amount}đ
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="product-list-tt" class="full-screen gap-3 py-12 px-16">
      <div class="d-flex w-100 gap-1">
      <span class="text-size-2 font-weight-600">Sản phẩm đặt mua</span>
    </div>
        ${productHTML}
      </div>
      <div class="full-screen px-16 py-12 gap-2">
        <div class="d-flex align-items-center justify-content-between w-100">
          <div class="d-flex align-items-center gap-1">
            <span class="text-size-2 font-weight-600"
              >Thông tin khách hàng</span
            >
          </div>
        </div>
        <div class="d-flex flex-column boder-input-group w-100">
          <div class="d-flex align-items-center gap-1 boder-input">
            <img src="Img/profile.svg" alt="" />
            <span>${data.customer.name}</span>
          </div>
          <div class="d-flex align-items-center gap-1 boder-input">
            <img src="Img/call.svg" alt="" />
            <span>${data.customer.phone}</span>
          </div>
          <div class="d-flex align-items-center gap-1 boder-input">
            <img src="Img/sms.svg" alt="" />
            <span>${data.customer.email || "Không có"}</span>
          </div>
        </div>
      </div>

      <div class="full-screen px-16 py-12 gap-2">
        <div class="d-flex align-items-center justify-content-between w-100">
          <div class="d-flex align-items-center gap-1">
            <span class="text-size-2 font-weight-600"
              >Hướng dẫn thanh toán</span
            >
          </div>
          <div>
            <img src="Img/Down.svg" alt="" />
          </div>
        </div>
        <div class="d-flex flex-column boder-input-group w-100">
          <div
            class="d-flex align-items-center justify-content-between gap-1 boder-input"
          >
            <div class="d-flex align-items-center gap-1">
              <div>
                <img height="32" src="Img/card.svg" alt="" />
              </div>
              <span class="text-size-2 font-weight-500"
                >Tài khoản ngân hàng 1</span
              >
            </div>
            <img src="Img/Down.svg" alt="" />
          </div>
        </div>
        <div class="d-flex flex-column gap-3 border-shadow w-100">
          <div class="d-flex align-items-flex-start gap-1">
            <img src="Img/logo-bank-1.png" alt="" />
            <div class="d-flex flex-column gap-1">
              <span class="text-size-1 font-weight-500">Techcombank</span>
              <span class="text-size-9 font-weight-400">PHAN HOÀNG BA</span>
            </div>
          </div>

          <div class="d-flex flex-column gap-1">
            <div class="d-flex gap-1 align-items-center">
              <img src="Img/solar_user-id-linear.svg" alt="" />
              <div>Số tài khoản</div>
            </div>
            <div
              class="d-flex justify-content-between align-items-center gap-1"
            >
              <span class="text-size-1 font-weight-500">0381000366372</span>
              <img src="Img/copy.svg" alt="" />
            </div>
          </div>

          <div class="d-flex flex-column gap-1">
            <div class="d-flex gap-1 align-items-center">
              <img src="Img/Note.svg" alt="" />
              <div>Nội dung chuyển khoản</div>
            </div>
            <div
              class="d-flex justify-content-between align-items-center gap-1"
            >
              <span class="text-size-1 font-weight-500">${data.code}</span>
              <img src="Img/copy.svg" alt="" />
            </div>
          </div>
          <div class="dashed-border"></div>
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-1">
              <img width="24" height="24" src="Img/wallet-money.svg" alt="" />
              <span class="text-size-2 font-weight-400">Tổng tiền hàng</span>
            </div>
            <span class="text-size-2 text-orange font-weight-700"
              >${data.amount}đ</span
            >
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-1">
              <img width="24" height="24" src="Img/calendar-2.svg" alt="" />
              <span class="text-size-2 font-weight-400">Mã đơn hàng</span>
            </div>
            <span class="text-size-2 text-parimary font-weight-700"
              >${data.code}</span
            >
          </div>
          <div class="dashed-border"></div>
          <div class="d-flex">
            <div class="status-order">Chờ thanh toán</div>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-1">
              <img width="24" height="24" src="Img/clock.svg" alt="" />
              <span class="text-size-2 font-weight-400"
                >Đơn hàng hết hạn sau</span
              >
              <div id="minutes" class="button-countdown">04</div>
              <span>:</span>
              <div id="seconds" class="button-countdown">04</div>
            </div>
            <img src="Img/ph_dots-three-circle-thin.svg" alt="" />
          </div>
        </div>
        <div class="text-size-2 font-weight-500">Hoặc quét mã OR Code</div>
        <div
          class="d-flex flex-column align-items-center gap-3 border-shadow w-100"
        >
          <img src="Img/viet-qr.png" alt="" />
          <img src="Img/Qrcode.png" alt="" />
          <div class="d-flex flex-column align-items-center gap-1">
            <span class="text-size-8 font-weight-400">PHAN HOÀNG BA</span>
            <span class="text-size-9 font-weight-500">0381000366372</span>
            <div class="d-flex gap-1">
              <span class="text-size-1 font-weight-500">Số tiền:</span>
              <span class="text-size-1 font-weight-500 text-red"
                >${data.amount}đ</span
              >
            </div>
          </div>
        </div>
        <div class="d-flex flex-column boder-input-group w-100">
          <div
            class="d-flex align-items-center justify-content-between gap-1 boder-input"
          >
            <div class="d-flex align-items-center gap-1">
              <img src="Img/card.svg" alt="" />
              <span class="text-size-2 font-weight-500"
                >Tài khoản ngân hàng 2</span
              >
            </div>
            <img src="Img/Down.svg" alt="" />
          </div>
        </div>
      </div>
  `;
    hideAllElements();
    showElementById("pay");
    scrollToTop();
    const minutes = document.getElementById("minutes");
    const seconds = document.getElementById("seconds");
    startCountdown(60 * 5, minutes, seconds);
  });

  const back = document.getElementById("back");
  back.addEventListener("click", function (e) {
    hideAllElements();
    showElementById("cart");
    scrollToTop();
  });

  const container_fast = document.getElementById("fast-container");
  const container_normal = document.getElementById("normal-container");

  const pay = document.getElementById("pay");
  pay.addEventListener("click", function (e) {
    console.log('e::::', e);
    //lay data o day nha
    console.log(data);
  });

  const radioButtons = document.querySelectorAll(
    'input[name="flexRadioDefault"]'
  );

  radioButtons[0].checked = true;
  container_fast.classList.add("selected-radio");
  container_normal.classList.remove("selected-radio");

  radioButtons.forEach((radio) => {
    radio.addEventListener("change", (event) => {
      if (event.target.id === "fast") {
        proxiedData.delivery_cost = 15000;
        delivery_cost.textContent = proxiedData.delivery_cost + "đ";
        container_fast.classList.add("selected-radio");
        container_normal.classList.remove("selected-radio");
      } else if (event.target.id === "normal") {
        proxiedData.delivery_cost = 10000;
        delivery_cost.textContent = proxiedData.delivery_cost + "đ";
        container_normal.classList.add("selected-radio");
        container_fast.classList.remove("selected-radio");
      }
    });
  });
}

const listIdMenu = ["cart", "pay"];

function showElementById(id) {
  var elements = document.querySelectorAll("." + id);
  elements.forEach((element) => {
    element.classList.remove("d-none");
  });
}

function hideAllElements() {
  listIdMenu.forEach(function (id) {
    var elements = document.querySelectorAll("." + id);
    elements.forEach((element) => {
      element.classList.add("d-none");
    });
  });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    // behavior: "smooth", // Smooth scrolling
  });
}

var modal = document.getElementById("myModal");

var openModalButton = document.getElementById("pay");

// var closeButton = document.getElementsByClassName("close-button")[0];
var closeModalButton = document.getElementById("closeModalButton");

openModalButton.addEventListener("click", function () {
  modal.style.display = "flex";
});

// closeButton.addEventListener("click", function () {
//   modal.style.display = "none";
// });

closeModalButton.addEventListener("click", function () {
  modal.style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

function startCountdown(duration, displayMinuit, displaySecon) {
  var timer = duration,
    minutes,
    seconds;
  var interval = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    displayMinuit.textContent = minutes;
    displaySecon.textContent = seconds;

    if (--timer < 0) {
      clearInterval(interval);
      alert("Hết giờ!");
    }
  }, 1000);
}

function formatDate(isoDate) {
  const date = new Date(isoDate);

  // Lấy giờ và phút
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // Lấy ngày, tháng và năm
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
}
hideAllElements();
showElementById("cart");

initData();
