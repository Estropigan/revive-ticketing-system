import React, { useState, useEffect } from "react";
import "../../../App.css";
import {
  Document,
  Page,
  Text,
  View,
  PDFDownloadLink,
  PDFViewer,
  Font,
  pdf,
} from "@react-pdf/renderer";
import Swal from "sweetalert2";
import ArialBold from "./fonts/arialbd.ttf";
import ArialNormal from "./fonts/arial.ttf";
import ArialItalic from "./fonts/ariali.ttf";
import BahnschriftBold from "./fonts/banchschrift/bahnschrift.ttf";
import { saveAs } from "file-saver";
import check from "../../../assets/images/check.png";


Font.register({
  family: "Arial",
  src: ArialBold,
});
Font.register({
  family: "ArialNormal",
  src: ArialNormal,
});
Font.register({
  family: "ArialItalic",
  src: ArialItalic,
});
Font.register({
  family: "bahnschrift",
  src: BahnschriftBold,
});

function GenerateTickets() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [rrp, setRrp] = useState("");
  const [save, setSave] = useState("");
  const [expiry, setExpiry] = useState("Expiry");
  const [percentOff, setpercentOff] = useState("");
  const [productBrand, setproductBrand] = useState("");
  const [productDesc, setproductDesc] = useState("");
  const [copies, setCopies] = useState(1);
  const [template, setTemplate] = useState("Small Tickets ($)");
  const [successMessage, setSuccessMessage] = useState("");
  const [ticketQueue, setTicketQueue] = useState([]);
  const [pdfBlob, setPdfBlob] = useState(null);

  const defaultValues = {
    productName: "Product Name",
    price: "Price",
    rrp: "",
    save: "",
    expiry: "Expiry",
    percentOff: "00%",
    productBrand: "Brand",
    productDesc: "Description",
  };

  const handleGenerateClick = async () => {
    const blob = await pdf(<MyDocument isPDFView={true} />).toBlob();
    const filename = "ticket.pdf";
    saveAs(blob, filename);
  };

  useEffect(() => {
    if (localStorage.getItem("loginSuccess") === "true") {
      Swal.fire({
        title: "Login Successful",
        text: `Welcome`,
        imageUrl: check,
        imageWidth: 100,
        imageHeight: 100,
        confirmButtonText: "OK",
        confirmButtonColor: "#0ABAA6",
      });
      localStorage.removeItem("loginSuccess");
    }
  }, []);
  //clear the forms
  const entriesCleared = () => {
    setSuccessMessage("Entries cleared successfully.");
    setTimeout(() => setSuccessMessage(""), 3000);
    setTicketQueue([]); // Clear the ticket queue
  };

  //limit ng text 17chars per line in small tickets product name
  const formatText = (text) => {
    const lines = [];
    for (let i = 0; i < text.length; i += 17) {
      lines.push(text.substring(i, i + 17));
      if (lines.length === 2) break;
    }
    return lines.join("\n");
  };

  //limit the text in brand input fields of Big Tickets
  const BrandformatText = (text) => {
    const lines = [];
    for (let i = 0; i < text.length; i += 12) {
      lines.push(text.substring(i, i + 12));
      if (lines.length === 1) break;
    }
    return lines.join("\n");
  };

  //limit ng text 17chars per line in small tickets description
  const DescriptionformatText = (text) => {
    const lines = [];
    for (let i = 0; i < text.length; i += 17) {
      lines.push(text.substring(i, i + 17));
      if (lines.length === 3) break;
    }
    return lines.join("\n");
  };

  //limit ng text 25chars per line in big tickets
  const BigformatText = (text) => {
    const lines = [];
    for (let i = 0; i < text.length; i += 24) {
      lines.push(text.substring(i, i + 24));
      if (lines.length === 3) break;
    }
    return lines.join("\n");
  };

  //limit of 2 characters in percentage
  const PercentageformatText = (number) => {
    const formattedNumber = number.slice(0, 2);
    return `${formattedNumber}%`;
  };

  //ticket styles
  const getTicketStyle = () => {
    switch (template) {
      case "Small Tickets (%)":
        return {
          height: "auto",
          width: "185px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "25px",
        };
      case "Big Tickets (P)":
        return {
          height: "100%",
          width: "850px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          paddingTop: "200px",
          paddingBottom: "200px",
        };
      case "Big Ticket (L)":
        return {
          height: "550px",
          width: "850px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          paddingTop: "25px",
        };
      default:
        return {
          height: "auto",
          width: "185px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "25px",
        };
    }
  };
  const handleAddToQueue = () => {
    // Capture current form values
    const newTickets = Array.from({ length: copies }, () => ({
      productName: productName,
      price: price,
      rrp: rrp,
      save: save,
      expiry: expiry,
      percentOff: percentOff,
      productBrand: productBrand,
      productDesc: productDesc,
      addedToQueue: true,
    }));

    setTicketQueue((prevQueue) => [...prevQueue, ...newTickets]);

    setProductName("");
    setPrice("");
    setRrp("");
    setSave("");
    setCopies(0);
    setExpiry("Expiry");
    setpercentOff("");
    setproductBrand("");
    setproductDesc("");

    setSuccessMessage("Added to queue successfully");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const MyDocument = ({ isPDFView }) => {
    const renderContent = (ticket) => {
      const values = {
        productName: ticket.productName || defaultValues.productName,
        price: ticket.price || defaultValues.price,
        rrp: ticket.rrp || defaultValues.rrp,
        save: ticket.save || defaultValues.save,
        expiry: ticket.expiry || defaultValues.expiry,
        percentOff: ticket.percentOff || defaultValues.percentOff,
        productBrand: ticket.productBrand || defaultValues.productBrand,
        productDesc: ticket.productDesc || defaultValues.productDesc,
      };

      switch (template) {
        case "Small Tickets (%)":
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView &&(
                <Text
                  style={{
                    position: "absolute",
                    top: -20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontFamily: "bahnschrift",
                    fontSize: 10,
                    textAlign: "center",
                    color: ticket.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                  className="no-print"
                >
                  {ticket.addedToQueue ? "Added to Queue" : "Not Added to Queue"}
                </Text>
              )}
              <Text style={{ fontSize: "65px", fontFamily: "bahnschrift" }}>
                {values.percentOff}
                <Text style={{ fontSize: "32px", fontFamily: "bahnschrift" }}>
                  OFF
                </Text>
              </Text>
              <Text
                style={{
                  fontSize: "17px",
                  fontFamily: "Arial",
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                {values.productDesc}
                {"\n"}
              </Text>
              <Text
                style={{
                  paddingTop: "5px",
                  fontSize: "10px",
                  textAlign: "center",
                  fontFamily: "ArialItalic",
                  paddingBottom:
                    values.productDesc.split("\n").length === 1
                      ? "120px"
                      : values.productDesc.split("\n").length === 2
                        ? "100px"
                        : "80px",
                }}
              >
                REVIVE OFFER AVAILABLE{"\n"}
                {formatDateForDisplay(values.expiry)}
              </Text>
            </div>
          );
        case "Big Tickets (P)":
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "absolute",
                    top: -20,
                    left: "50%",
                    transform: "translateX(-155%)",
                    fontFamily: "bahnschrift",
                    fontSize: 20,
                    textAlign: "center",
                    color: ticket.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                  className="no-print"
                >
                  {ticket.addedToQueue ? "Added to Queue" : "Not Added to Queue"}
                </Text>
              )}
              <Text
                style={{
                  fontSize: "72px",
                  fontFamily: "Arial",
                  textTransform: "uppercase",
                }}
              >
                {values.productBrand}
              </Text>
              <Text
                style={{
                  fontSize: "45px",
                  fontFamily: "Arial",
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              >
                {values.productName}
                {"\n"}
              </Text>
              <Text style={{ fontSize: "180px", fontFamily: "Arial" }}>
                {values.price}
              </Text>
              <Text style={{ fontSize: "14px", fontFamily: "ArialItalic" }}>
                REVIVE OFFER AVAILABLE - {formatDateForDisplay(values.expiry)}
              </Text>
            </div>
          );
        case "Big Ticket (L)":
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "absolute",
                    top: -20,
                    left: "50%",
                    transform: "translateX(-285%)",
                    fontFamily: "bahnschrift",
                    fontSize: 20,
                    textAlign: "center",
                    color: ticket.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                  className="no-print"
                >
                  {ticket.addedToQueue ? "Added to Queue" : "Not Added to Queue"}
                </Text>
              )}

              <Text
                style={{
                  fontSize: "72px",
                  fontFamily: "Arial",
                  textTransform: "uppercase",
                }}
              >
                {values.productBrand}
              </Text>
              <Text
                style={{
                  fontSize: "45px",
                  fontFamily: "Arial",
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              >
                {values.productName}
                {"\n"}
              </Text>
              <Text style={{ fontSize: "180px", fontFamily: "Arial" }}>
                {values.price}
              </Text>
              <Text style={{ fontSize: "14px", fontFamily: "ArialItalic" }}>
                REVIVE OFFER AVAILABLE - {formatDateForDisplay(values.expiry)}
              </Text>
            </div>
          );
        default:
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "absolute",
                    top: -20,
                    left: "50%",
                    transform: "translateX(-60%)",
                    fontFamily: "bahnschrift",
                    fontSize: 10,
                    textAlign: "center",
                    color: ticket.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                  className="no-print"
                >
                  {ticket.addedToQueue ? "Added to Queue" : "Not Added to Queue"}
                </Text>
              )}
              <Text
                style={{
                  fontSize: "16px",
                  textTransform: "uppercase",
                  fontFamily: "Arial",
                  textAlign: "center",
                }}
              >
                {values.productName}
                {"\n"}
              </Text>
              <Text
                style={{
                  fontSize: 48,
                  paddingBottom: 10,
                  paddingTop: 10,
                  fontFamily: "Arial",
                }}
              >
                {values.price}
              </Text>
              <Text style={{ fontSize: "10px", fontFamily: "Arial" }}>
                RRP ${values.rrp}
              </Text>
              <Text style={{ fontSize: "14px", fontFamily: "Arial" }}>
                Save ${values.save}
              </Text>
              <Text
                style={{
                  fontSize: "10px",
                  textAlign: "center",
                  paddingBottom: values.productName.includes("\n")
                    ? "75px"
                    : "100px",
                  fontFamily: "ArialNormal",
                }}
              >
                REVIVE OFFER AVAILABLE{"\n"}
                {formatDateForDisplay(values.expiry)}
              </Text>
            </div>
          );
      }
    };

    const getTicketContainers = () => {

      const numberOfCopies = copies || 0;
      // if (numberOfCopies === 0) {
      //   return (
      //     <View
      //       style={{
      //         display: "flex",
      //         justifyContent: "center",
      //         alignItems: "center",
      //         paddingTop: "50%",
      //         paddingbottom: "50%",
      //         fontSize: "30px"
      //       }}
      //     >
      //      {allT}
      //     </View>
      //   );
      // }

      const livePreviewTicket = {
        productName: productName || defaultValues.productName,
        price: price || defaultValues.price,
        rrp: rrp || defaultValues.rrp,
        save: save || defaultValues.save,
        expiry: expiry || defaultValues.expiry,
        percentOff: percentOff || defaultValues.percentOff,
        productBrand: productBrand || defaultValues.productBrand,
        productDesc: productDesc || defaultValues.productDesc,
        addedToQueue: false,
      };


      const handleAddToQueue = () => {
        const newTickets = Array(numberOfCopies).fill({ ...livePreviewTicket, addedToQueue: true });
        setTicketQueue([...ticketQueue, ...newTickets]);
      };


      const livePreviewTickets = Array(numberOfCopies).fill(livePreviewTicket);
      const allTickets = [...ticketQueue, ...livePreviewTickets];

      const containerGroups = [];
      const ticketStyle = getTicketStyle();
      const maxTicketsPerPage = template.includes("Small") ? 9 : 1;


      for (let i = 0; i < allTickets.length; i += maxTicketsPerPage) {
        const currentGroup = [...Array(Math.min(maxTicketsPerPage, allTickets.length - i))].map((_, index) => {
          const currentTicket = allTickets[i + index];

          return (
            <View key={index} style={ticketStyle}>
              {renderContent(currentTicket)}
              {!currentTicket.addedToQueue && index < numberOfCopies && (
                <button onClick={handleAddToQueue}>Add to Queue</button>
              )}
            </View>
          );
        });

        containerGroups.push(
          <View
            key={`container-${i}`}
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "content-start",
              alignItems: "center",
              paddingTop: "20px",
              paddingLeft: "10px",
              paddingRight: "10px",
            }}
          >
            {currentGroup}
          </View>
        );
      }

      return containerGroups;
    };




    const pageSize = template.includes("Big") ? "A4" : "A4";
    const pageOrientation = template.includes("Big Ticket (L)")
      ? "landscape"
      : "portrait";

    return (
      <Document>
        <Page size={pageSize} orientation={pageOrientation}>
          {getTicketContainers()}
        </Page>
      </Document>
    );
  };

  //form fields
  const renderFormFields = () => {
    switch (template) {
      case "Small Tickets (%)":
        return (
          <>
            <div className="form-group">
              <label>Percent Off</label>
              <input
                type="number"
                className="form-control"
                value={percentOff.replace("%", "")}
                onChange={(e) =>
                  setpercentOff(PercentageformatText(e.target.value))
                }
                max="99"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                className="form-control"
                value={productDesc}
                onChange={(e) =>
                  setproductDesc(DescriptionformatText(e.target.value))
                }
              />
            </div>
            <div className="form-group">
              <label>Expiry</label>
              <input
                type="date"
                className="form-control"
                value={expiry}
                onChange={handleExpiryChange}
              />
            </div>
          </>
        );
      case "Big Tickets (P)":
        return (
          <>
            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                className="form-control"
                value={productBrand}
                onChange={(e) =>
                  setproductBrand(BrandformatText(e.target.value))
                }
              />
            </div>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                className="form-control"
                value={productName}
                onChange={(e) => setProductName(BigformatText(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                className="form-control"
                value={price.replace("$", "")}
                onChange={(e) => setPrice("$" + e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Expiry</label>
              <input
                type="date"
                className="form-control"
                value={expiry}
                onChange={handleExpiryChange}
              />
            </div>
          </>
        );
      case "Big Ticket (L)":
        return (
          <>
            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                className="form-control"
                value={productBrand}
                onChange={(e) =>
                  setproductBrand(BrandformatText(e.target.value))
                }
              />
            </div>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                className="form-control"
                value={productName}
                onChange={(e) => setProductName(BigformatText(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                className="form-control"
                value={price.replace("$", "")}
                onChange={(e) => setPrice("$" + e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Expiry</label>
              <input
                type="date"
                className="form-control"
                value={expiry}
                onChange={handleExpiryChange}
              />
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                className="form-control"
                value={productName}
                onChange={(e) => setProductName(formatText(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                className="form-control"
                value={price.replace("$", "")}
                onChange={(e) => setPrice("$" + e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>RRP</label>
              <input
                type="number"
                className="form-control"
                value={rrp}
                onChange={(e) => setRrp(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Save</label>
              <input
                type="number"
                className="form-control"
                value={save}
                onChange={(e) => setSave(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Expiry</label>
              <input
                type="date"
                className="form-control"
                value={expiry}
                onChange={handleExpiryChange}
              />
            </div>
          </>
        );
    }
  };

  //handle printing tickets
  const handlePrint = async () => {
    if (ticketQueue.length === 0) {
      Swal.fire({
        title: "No Tickets",
        text: "Please add tickets to the queue before printing.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#0ABAA6",
      });
      return;
    }

    const blob = await pdf(<MyDocument isPDFView={true} />).toBlob();
    setPdfBlob(blob);

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.src = URL.createObjectURL(blob);
    document.body.appendChild(iframe);
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };

  //limit the year to 4 digits
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };


  const formatDateForDisplay = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };


  useEffect(() => {
    setExpiry(getTodayDate());
  }, []);

  const handleExpiryChange = (e) => {
    setExpiry(e.target.value);
  };




  return (
    <div className="container generate-ticket-container">
      <div className="col-md-12">
        <div className="row pl-4">
          <h3>Revive Pharmacy Price Ticket Generator</h3>

          <div className="ticket-filter">
            <h5>Select Ticket Template</h5>
            <select
              name="ticketTemplate"
              id="ticketTemplate"
              onChange={(e) => setTemplate(e.target.value)}
              value={template}
            >
              <option value="Small Tickets ($)">Small Tickets ($)</option>
              <option value="Small Tickets (%)">Small Tickets (%)</option>
              <option value="Big Tickets (P)">Big Tickets (P)</option>
              <option value="Big Ticket (L)">Big Ticket (L)</option>
            </select>
          </div>
        </div>
      </div>
      <div className="col-md-12">
        <div className="row">
          <div className="container-content">
            <div className="col-md-5 p-3 mr-5 ticket-form">
              <h5>Enter Text below</h5>
              <form>
                {successMessage && (
                  <div className="alert alert-success">{successMessage}</div>
                )}
                {renderFormFields()}
                <label className="mb-2">Copies</label>
                <div className="d-flex justify-content-between">
                  <input
                    type="number"
                    placeholder="1"
                    min={0}
                    className="form-control ticket-copies-field"
                    value={copies}
                    onChange={(e) => setCopies(Number(e.target.value))}
                  />

                  <button
                    type="button"
                    className="add-to-queue-btn"
                    onClick={handleAddToQueue}
                    disabled={copies === 0}
                  >
                    Add to Queue
                  </button>

                  <button
                    type="button"
                    className="clear-btn"
                    onClick={() => {
                      setProductName("");
                      setproductBrand("");
                      setPrice("");
                      setRrp("");
                      setSave("");
                      setExpiry("");
                      setCopies(0);
                      entriesCleared(); 
                    }}
                  >
                    Clear Entries
                  </button>
                </div>
                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="print-btn"
                    onClick={handleGenerateClick}
                  >
                    Generate Tickets
                  </button>
                  <button
                    type="button"
                    className="generate-tickets-btn"
                    onClick={handlePrint}
                  >
                    Print
                  </button>
                </div>
              </form>
            </div>

            <div className="col-md-6 ticket-view">
              <h5 className="mt-3" style={{fontSize: "24px", fontFamily: "bahnschrift"}}>PDF Live Preview</h5>
              <div className="pdf-preview">
                <PDFViewer
                  showToolbar={false}
                  style={{ width: "100%", height: "705px" }}
                >
                  <MyDocument />
                </PDFViewer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenerateTickets;
