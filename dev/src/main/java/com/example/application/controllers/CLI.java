package com.example.application.controllers;

import java.util.Arrays;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Option;
import org.apache.commons.cli.OptionGroup;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Controller;

import com.example.application.Application;
import com.example.application.model.DumpDatabase;

@Controller
public class CLI {

    private static Options options;
    static {
        options = new Options();
        OptionGroup group = new OptionGroup();
        group.addOption(Option.builder("w").longOpt("web").desc("Starts web server").build());
        group.addOption(Option.builder("d").longOpt("dump").desc("Dumps database contents").build());
        group.addOption(Option.builder("h").longOpt("help").desc("Shows command line help").build());
        options.addOptionGroup(group);
    }

    public static CommandLine parse(String[] args) throws ParseException {
        // https://commons.apache.org/proper/commons-cli/usage.html
        CommandLineParser parser = new DefaultParser();
        try {
            return parser.parse(options, args);
        } catch (ParseException pe) {
            System.err.println("Parsing failed. Reason: " + pe.getMessage());
            help();
            throw pe;
        }
    }

    public static void main(String[] args) throws Exception {
        CommandLine cl = parse(args);
        if (cl.hasOption("h")) {
            help();
        } else {
            // The rest of options require Spring to boot
            SpringApplication.run(Application.class, args);
        }
    }

    @Bean
    public CommandLineRunner commandLineRunner(ApplicationContext ctx) {
        return args -> {
            CommandLine cl = parse(args);
            if (cl.hasOption("w")) {
                System.out.println("Web server started");
                // Web server started, do not stop
            } else if (cl.hasOption("d")) {
                dump();
                SpringApplication.exit(ctx);
            } else {
                System.out.println("Unknown option");
                // http://stackoverflow.com/a/34946292/1898234
                SpringApplication.exit(ctx, () -> -1);
            }
        };
    }

    public static void help() {
        HelpFormatter formatter = new HelpFormatter();
        formatter.printHelp("java ... ", options);
    }

    public void printBeans(ApplicationContext ctx) {
        System.out.println("Let's inspect the beans provided by Spring Boot:");
        String[] beanNames = ctx.getBeanDefinitionNames();
        Arrays.sort(beanNames);
        for (String beanName : beanNames) {
            System.out.println(beanName);
        }
    }

    @Autowired
    protected DumpDatabase _dumpDatabase;

    public void dump() {
        System.out.println("Dumping database...");
        System.out.println(_dumpDatabase.dump());
    }
}
