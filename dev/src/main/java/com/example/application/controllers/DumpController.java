package com.example.application.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.application.model.DumpDatabase;

@Controller
public class DumpController {

    @Autowired
    protected DumpDatabase _dumpDatabase;

    @RequestMapping("/dump")
    public String greeting(Model model) {
        model.addAttribute("contents", _dumpDatabase.dump());
        return "dump";
    }
}
