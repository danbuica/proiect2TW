<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<jsp:include page="/WEB-INF/common/err.jsp"/>
<div id="tabHeader">
    <button type="button" id="th-general" onclick="openTab(this, 'tab-general')">Date generale</button>
    <c:if test="${ss.view}">
        <button type="button" id="th-harta" onclick="openTab(this, 'tab-harta');createMap();">Harta interioara</button>
    </c:if>
</div>

<input id="filePath" style="display:none" value="${filePath}" disabled>
<div id="tab-general" class="tab">
    <br><br>
    <table class="tblForm">
        <tr>
            <td>Nume spatiu</td>
            <td>
                <c:if test="${ss.view}">
                    <input type="text" value="${record.nume}" disabled>
                </c:if>
                <c:if test="${ss.editable}">
                    <form:input path="nume" cssErrorClass="err"/>
                </c:if>
            </td>
        </tr>
        <tr>
            <td>Latime</td>
            <td>
                <c:if test="${ss.view}">
                    <input type="text" value="${record.width}" disabled> metri
                </c:if>
                <c:if test="${ss.editable}">
                    <form:input path="width" cssErrorClass="err"/> metri
                </c:if>
            </td>
        </tr>
        <tr>
            <td>Inaltime</td>
            <td>
                <c:if test="${ss.view}">
                    <input type="text" value="${record.height}" disabled> metri
                </c:if>
                <c:if test="${ss.editable}">
                    <form:input path="height" cssErrorClass="err"/> metri
                </c:if>
            </td>
        </tr>
    </table>
</div>

<c:if test="${ss.view}">
    <div id="tab-harta" class="tab">
        <div id="scrollContainer" style="z-index: 1; height: 450px; width: 1020px; height: 600px; position: relative; overflow:scroll; background-color: lightgrey;">
            <div id="mapContainer" style="border: 1px solid black; z-index: -1; position: relative; background-color: white" ></div>
        </div>
           <div id="custom-menu">
               <p data-action="viewEmployee"><img style="width: 14px; height: 14px;" src="${pageContext.request.contextPath}/img/actions/view.png"> Vezi angajat</p>
               <p data-action="view"><img style="width: 14px; height: 14px;" src="${pageContext.request.contextPath}/img/actions/view.png"> Detalii</p>
               <p data-action="edit"><img style="width: 14px; height: 14px;" src="${pageContext.request.contextPath}/img/actions/edit.png"> Editare</p>
               <p data-action="delete"><img style="width: 14px; height: 14px;" src="${pageContext.request.contextPath}/img/actions/delete.png"> Ştergere</p>
           </div>

    </div>
</c:if>