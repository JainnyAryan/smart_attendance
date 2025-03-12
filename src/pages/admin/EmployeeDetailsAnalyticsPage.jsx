import { Box, Button } from '@mui/material'
import React, { useRef, useState } from 'react'
import Navbar from '../../components/Navbar'
import EmployeeDetailsAnalytics from '../../components/EmployeeDetailsAnalytics'
import { useLocation } from 'react-router-dom'
import { Print } from '@mui/icons-material'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const EmployeeDetailsAnalyticsPage = () => {
    const [isGenerating, setIsGenerating] = useState(false);

    const location = useLocation();
    const employee = location.state.employee;
    const printRefs = { analyticsRef: useRef(), calendarRef: useRef(), infoRef: useRef() };

    const handlePrint = async () => {
        setIsGenerating(true);

        try {
            const pdf = new jsPDF("p", "mm", "a4");

            // Function to add each section to the PDF
            const addPageFromRef = async (ref, isFirstPage = false) => {
                const element = ref.current;
                if (!element) return;

                const canvas = await html2canvas(element, { scale: 2 });
                const imgData = canvas.toDataURL("image/png", 0.1);

                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                let y = 0;
                const pageHeight = pdf.internal.pageSize.getHeight();

                // Add pages if content overflows
                while (y < pdfHeight) {
                    if (!isFirstPage || y > 0) {
                        pdf.addPage();
                    }
                    pdf.addImage(imgData, "PNG", 0, -y, pdfWidth, pdfHeight, null, 'FAST');
                    y += pageHeight;
                }
            };

            // Add each section to the PDF (each on a new page)
            await addPageFromRef(printRefs.infoRef, true);
            await addPageFromRef(printRefs.calendarRef);
            await addPageFromRef(printRefs.analyticsRef);

            // Trigger "Save As" dialog
            pdf.save(`${employee.name}_analytics.pdf`);
        } catch (error) {
            console.error("PDF generation failed:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center" }}>
            <Navbar titleText={employee.name} needsBackButton />
            <EmployeeDetailsAnalytics employee={employee} printRefs={printRefs} />
            <Button variant='contained' onClick={() => { handlePrint(); }} disabled={isGenerating} sx={{ width: { xs: "80%", md: "70%", lg: "20%" } }}>
                Save as PDF <Box mr={1} /> <Print />
            </Button>
            <Box mt={2} />
        </Box>
    )
}

export default EmployeeDetailsAnalyticsPage