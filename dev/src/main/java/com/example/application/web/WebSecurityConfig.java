package com.example.application.web;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private DataSource _dataSource;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                // If /login and /logout are not public, login again after
                // logout will take us back to /login?logout instead of the
                // previous address
                .antMatchers("/resources/**", "/webjars/**", "/login", "/logout").permitAll()
                .anyRequest().authenticated().and()
                .formLogin().loginPage("/login").failureUrl("/login?error").and()
                // http://stackoverflow.com/a/24987207/1898234
                .logout()
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .logoutSuccessUrl("/login?logout");
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.jdbcAuthentication().dataSource(_dataSource)
                // https://dzone.com/articles/spring-security-4-authenticate-and-authorize-users
                .usersByUsernameQuery(
                        "select Name as username, Password as password, Enabled as enabled from User where Name = ?")
                .authoritiesByUsernameQuery("select Name as username, 'ROLE' as role from User where Name = ?");
    }
}
