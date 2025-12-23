"use client";

import React from "react";
import { ProofOfWork as ProofOfWorkType } from "@/types/delegate";

// Helper to get random skill color for UI
const getSkillColor = (skill: string): "green" | "orange" | "purple" => {
    const hash = skill.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors: ("green" | "orange" | "purple")[] = ["green", "orange", "purple"];
    return colors[hash % colors.length];
};

const getSkillBadgeColor = (color: "green" | "orange" | "purple") => {
    switch (color) {
        case "green":
            return "bg-[#10563F] text-white border border-[#08B67C]";
        case "orange":
            return "bg-[#BF4E02] text-white border border-[#FFDCC548]";
        case "purple":
            return "bg-[#510350] text-white border border-[#FA45F848]";
        default:
            return "bg-gray-500 text-white";
    }
};

interface ProofOfWorkProps {
    data: ProofOfWorkType[];
    onAddMore?: () => void;
    isOwnProfile?: boolean;
}

const ProofOfWork = ({ data, onAddMore, isOwnProfile }: ProofOfWorkProps) => {
    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between w-full px-[16px] border-b-[0.5px] border-[#E7E7E7] py-4 gap-4 md:gap-0">
                <h2 className="font-(family-name:--font-geist-sans) font-medium text-[20px] leading-[100%] tracking-[0%] text-[#101828B2]">
                    Proof of work
                </h2>
                {isOwnProfile && (
                    <button
                        onClick={onAddMore}
                        className="flex items-center justify-center text-white font-(family-name:--font-geist-sans) font-medium text-[14px] leading-[100%] hover:opacity-90 transition-opacity"
                        style={{
                            background: '#010101',
                            width: '115px',
                            height: '44px',
                            gap: '4px',
                            borderRadius: '5px',
                            paddingTop: '12px',
                            paddingRight: '8px',
                            paddingBottom: '12px',
                            paddingLeft: '8px',
                            border: '2px solid',
                            borderImage: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%) 1'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 18.75C5.175 18.75 1.25 14.825 1.25 10C1.25 5.175 5.175 1.25 10 1.25C14.825 1.25 18.75 5.175 18.75 10C18.75 14.825 14.825 18.75 10 18.75ZM10 2.5C5.8625 2.5 2.5 5.8625 2.5 10C2.5 14.1375 5.8625 17.5 10 17.5C14.1375 17.5 17.5 14.1375 17.5 10C17.5 5.8625 14.1375 2.5 10 2.5Z" fill="white" />
                            <path d="M10 14.375C9.65 14.375 9.375 14.1 9.375 13.75V6.25C9.375 5.9 9.65 5.625 10 5.625C10.35 5.625 10.625 5.9 10.625 6.25V13.75C10.625 14.1 10.35 14.375 10 14.375Z" fill="white" />
                            <path d="M13.75 10.625H6.25C5.9 10.625 5.625 10.35 5.625 10C5.625 9.65 5.9 9.375 6.25 9.375H13.75C14.1 9.375 14.375 9.65 14.375 10C14.375 10.35 14.1 10.625 13.75 10.625Z" fill="white" />
                        </svg>
                        Add More
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className="flex flex-col gap-4 bg-gray-50/50 p-4">
                {data.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white border border-gray-100 rounded-xl p-5 transition-shadow"
                        style={{ boxShadow: '0px 1px 40px 0px #1018280D' }}
                    >
                        <div className="flex flex-col gap-3">
                            {/* Title and Edit Button */}
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="font-(family-name:--font-geist-sans) font-normal text-[16px] leading-[24px] text-[#101828]">
                                    {item.workTitle}
                                </h3>
                                <button className="flex items-center gap-1 font-(family-name:--font-geist-sans) font-normal text-[14px] leading-[100%] hover:opacity-80 transition-opacity flex-shrink-0">
                                    <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.83333 1.94772L9.83333 3.94771M6.5 11.281H11.8333M1.16667 8.61438L0.5 11.281L3.16667 10.6144L10.8907 2.89038C11.1406 2.64034 11.281 2.30127 11.281 1.94772C11.281 1.59416 11.1406 1.25509 10.8907 1.00505L10.776 0.890382C10.526 0.640421 10.1869 0.5 9.83333 0.5C9.47978 0.5 9.1407 0.640421 8.89067 0.890382L1.16667 8.61438Z" stroke="url(#paint0_linear_3274_11655)" strokeLinecap="round" strokeLinejoin="round" />
                                        <defs>
                                            <linearGradient id="paint0_linear_3274_11655" x1="11.8333" y1="5.89053" x2="0.5" y2="5.89053" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#22E9AD" />
                                                <stop offset="1" stopColor="#9846FE" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <span style={{ background: 'linear-gradient(270deg, #22E9AD 0%, #9846FE 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                        Edit <span className="hidden sm:inline">personal information</span>
                                    </span>
                                </button>
                            </div>

                            {/* DAO Name with verification badge */}
                            <div className="flex items-center gap-2">
                                <span className="font-(family-name:--font-geist-sans) font-normal text-[18px] leading-[100%] tracking-[0%] text-[#101828B2]">
                                    {item.daoName}
                                </span>
                                {/* Assuming verified if it exists in the list for now, or we can add a verified field to type later */}
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="8" cy="8" r="7" fill="#101828" />
                                    <path d="M5.33333 8L7.33333 10L10.6667 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            {/* Skills */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-(family-name:--font-geist-sans) font-normal text-[14px] leading-[100%] tracking-[0%] text-[#909090]">
                                    Skill(s) required:
                                </span>
                                {item.skillsRequired.map((skill, index) => (
                                    <span
                                        key={index}
                                        className={`${getSkillBadgeColor(getSkillColor(skill))} px-3 py-1.5 rounded-full font-(family-name:--font-geist-sans) font-medium text-[12px] leading-[100%]`}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProofOfWork;
